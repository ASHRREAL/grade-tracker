export type Assessment = {
  id: string;
  name: string;
  category: string; // "Lab", "Quiz", ...
  weight: number;   // percent, e.g. 15 means 15%
  score?: number;   // percent, e.g. 92 means 92%. undefined = not graded yet
  isFinal?: boolean;
};

export type GradingScheme = {
  id: string;
  name: string;
  assessments: Assessment[];
};

export type Course = {
  id: string;
  name: string;
  credits: number;
  target: number; // percent target, e.g. 85
  assessments: Assessment[];
  // Multiple grading schemes support
  gradingSchemes?: GradingScheme[];
  activeSchemeIndex?: number;
};

export function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function currentTotal(course: Course): number {
  // Sum(weight * score) ignoring ungraded rows
  let sum = 0;
  for (const a of course.assessments) {
    if (a.score === undefined || Number.isNaN(a.score)) continue;
    sum += (a.weight / 100) * (a.score / 100) * 100; // back to percent
  }
  return sum; // percent
}

export function finalWeight(course: Course): number {
  return course.assessments.reduce((s, a) => s + (a.isFinal ? (a.weight || 0) : 0), 0);
}

export function requiredFinal(course: Course): number | null {
  const targetFrac = course.target / 100;

  let nonFinalSumFrac = 0;
  let gradedFinalSumFrac = 0;
  let remainingFinalWeightFrac = 0;

  for (const a of course.assessments) {
    const weightFrac = (a.weight || 0) / 100;
    const hasScore = a.score !== undefined && !Number.isNaN(a.score);

    if (a.isFinal) {
      if (hasScore) gradedFinalSumFrac += weightFrac * ((a.score as number) / 100);
      else remainingFinalWeightFrac += weightFrac;
      continue;
    }

    if (!hasScore) continue;
    nonFinalSumFrac += weightFrac * ((a.score as number) / 100);
  }

  if (remainingFinalWeightFrac <= 0) return null;

  const req = ((targetFrac - nonFinalSumFrac - gradedFinalSumFrac) / remainingFinalWeightFrac) * 100;
  return clamp(req, 0, 200);
}

// Your GPA scale (same as your Excel IFS)
export function gradePointFromPercent(p: number): number {
  if (p >= 85) return 4.0;
  if (p >= 80) return 3.7;
  if (p >= 77) return 3.3;
  if (p >= 73) return 3.0;
  if (p >= 70) return 2.7;
  if (p >= 67) return 2.3;
  if (p >= 63) return 2.0;
  if (p >= 60) return 1.7;
  if (p >= 57) return 1.3;
  if (p >= 53) return 1.0;
  if (p >= 50) return 0.7;
  return 0.0;
}

export function overallGpa(courses: Course[]): number | null {
  const totalCredits = courses.reduce((s, c) => s + (c.credits || 0), 0);
  if (totalCredits <= 0) return null;

  const qp = courses.reduce((s, c) => {
    const cur = currentTotal(c);
    const gp = gradePointFromPercent(cur);
    return s + gp * c.credits;
  }, 0);

  return qp / totalCredits;
}

export function weightsSum(course: Course): number {
  return course.assessments.reduce((s, a) => s + (a.weight || 0), 0);
}
