import type { Assessment, Course, GradingScheme } from "./grade";

export type ParsedCourse = {
  name: string;
  credits: number;
  schemes: {
    name: string;
    assessments: Omit<Assessment, "id" | "score">[];
  }[];
};

// Groq API - generous free tier
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const AI_MODELS = [
  { id: "groq/compound", name: "Groq Compound", context: "70K" },
  { id: "groq/compound-mini", name: "Groq Compound Mini", context: "70K" },
  { id: "meta-llama/llama-4-scout-17b-16e-instruct", name: "Llama 4 Scout", context: "30K" },
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", context: "12K" },
  { id: "qwen/qwen3-32b", name: "Qwen 3 32B", context: "6K" },
] as const;

export type AIModelId = typeof AI_MODELS[number]["id"];

const SYSTEM_PROMPT = `You are a course outline parser. Extract ALL courses from the text and return ONLY valid JSON.

**CRITICAL: MULTIPLE COURSES**
The input may contain outlines for MULTIPLE different courses (e.g., MATH*2130, CIS*2520, ENGG*2400).
You MUST extract EVERY course found - look for different course codes, titles, or "Course:" headers.
DO NOT stop after the first course - scan the ENTIRE text for all courses.

RULES FOR CALCULATING WEIGHTS:
1. If assessments say "best X of Y" or "lowest Z dropped", only create entries for the ones that COUNT.
   Example: "6 quizzes with 2 lowest dropped = 10%" → only 4 quizzes count
   Create exactly 4 quiz entries (Quiz 1-4), each worth 10/4 = 2.5%
   
2. If assessments are "equally weighted", divide the total weight by the count.
   Example: "3 assignments equally weighted = 24%" → each = 8%
   
3. For multiple grading schemes (Scheme 1/2 or A/B), parse ALL schemes as separate entries within that course.

4. Look for course code patterns like "MATH*2130", "CIS*1300", "ENGG*2400" for course names.

5. Credits are usually listed as "Credits: 0.50" or "0.5 credits". Default to 0.5 if not found.

Return format:
{
  "courses": [
    {
      "name": "MATH*2130 - Numerical Methods",
      "credits": 0.5,
      "schemes": [
        {
          "name": "Scheme 1",
          "assessments": [
            { "name": "Quiz 1", "category": "Quiz", "weight": 2.5, "isFinal": false },
            { "name": "Final Exam", "category": "Final", "weight": 40, "isFinal": true }
          ]
        }
      ]
    },
    {
      "name": "CIS*2520 - Data Structures",
      "credits": 0.5,
      "schemes": [...]
    }
  ]
}

IMPORTANT:
- The "courses" array MUST contain ALL courses found in the text
- Carefully scan for course boundaries (new course codes, "Course:", page breaks)
- "weight" = weight per INDIVIDUAL assessment
- Only create entries for assessments that COUNT toward the final grade
- The total of all weights in a scheme should equal 100%
- Categories: "Assignment", "Lab", "Quiz", "Midterm", "Test", "Final", "Project", "Participation", "Other"
- Only the final exam gets "isFinal": true
- Return ONLY JSON, no markdown or explanation`;

export async function parseOutlineWithGroq(
  text: string,
  apiKey: string,
  model: AIModelId = "meta-llama/llama-4-scout-17b-16e-instruct"
): Promise<ParsedCourse[]> {

  const modelContextChars: Record<string, number> = {
    "meta-llama/llama-4-scout-17b-16e-instruct": 100000, // 30K context
    "llama-3.3-70b-versatile": 35000, // 12K context
    "qwen/qwen3-32b": 18000, // 6K context
  };
  const maxChars = modelContextChars[model] ?? 35000;
  
  let truncatedText = text;
  if (text.length > maxChars) {
    console.warn(`Text too long (${text.length} chars), truncating to ${maxChars}`);
    truncatedText = text.substring(0, maxChars) + "\n\n[Text truncated - paste only the grading/assessment sections for best results]";
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Parse ALL courses from this text. There may be multiple courses - extract every one you find:\n\n${truncatedText}` },
      ],
      temperature: 0.1,
      max_tokens: 8192,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Groq API error:", error);
    throw new Error(`Groq API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const responseText = data.choices?.[0]?.message?.content;

  if (!responseText) {
    throw new Error("No response from Groq");
  }

  // Clean up the response - remove markdown code blocks if present
  let jsonStr = responseText.trim();
  if (jsonStr.startsWith("```json")) {
    jsonStr = jsonStr.slice(7);
  } else if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.slice(3);
  }
  if (jsonStr.endsWith("```")) {
    jsonStr = jsonStr.slice(0, -3);
  }
  jsonStr = jsonStr.trim();

  try {
    const parsed = JSON.parse(jsonStr);
    console.log("Parsed courses:", parsed.courses);
    return parsed.courses as ParsedCourse[];
  } catch (e) {
    console.error("Failed to parse Groq response:", jsonStr);
    throw new Error("Failed to parse AI response as JSON");
  }
}

export function convertParsedToCourse(parsed: ParsedCourse, schemeIndex: number = 0): Course {
  const gradingSchemes: GradingScheme[] = parsed.schemes.map(s => ({
    id: crypto.randomUUID(),
    name: s.name,
    assessments: s.assessments.map(a => ({
      ...a,
      id: crypto.randomUUID(),
      score: undefined,
    })),
  }));

  return {
    id: crypto.randomUUID(),
    name: parsed.name,
    credits: parsed.credits,
    target: 80,
    assessments: gradingSchemes[schemeIndex]?.assessments || [],
    gradingSchemes: gradingSchemes.length > 1 ? gradingSchemes : undefined,
    activeSchemeIndex: gradingSchemes.length > 1 ? schemeIndex : undefined,
  };
}

// Store API key in localStorage
const API_KEY_STORAGE = "grade-tracker:groq-api-key";

export function getStoredApiKey(): string | null {
  try {
    const key = localStorage.getItem(API_KEY_STORAGE);
    console.log("Loaded API key from storage:", key ? "exists" : "null");
    return key;
  } catch (e) {
    console.error("Failed to load API key:", e);
    return null;
  }
}

export function setStoredApiKey(key: string) {
  try {
    localStorage.setItem(API_KEY_STORAGE, key);
    console.log("Saved API key to storage");
  } catch (e) {
    console.error("Failed to save API key:", e);
  }
}
