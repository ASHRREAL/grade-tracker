import type { Course } from "./grade";
import { invoke } from "@tauri-apps/api/core";

export type Semester = {
  id: string;
  name: string;
  courses: Course[];
};

type StoredData = {
  semesters: Semester[];
  activeSemesterId: string | null;
};

let cachedData: StoredData | null = null;

async function loadFromFile(): Promise<StoredData> {
  try {
    const raw = await invoke<string>("load_data");
    const parsed = JSON.parse(raw) as Partial<StoredData>;
    return {
      semesters: parsed.semesters ?? [],
      activeSemesterId: parsed.activeSemesterId ?? null,
    };
  } catch {
    return { semesters: [], activeSemesterId: null };
  }
}

async function saveToFile(data: StoredData): Promise<void> {
  try {
    await invoke("save_data", { data: JSON.stringify(data, null, 2) });
  } catch (e) {
    console.error("Failed to save data:", e);
  }
}

// Synchronous versions that use cache (for React state initialization)
export function loadSemesters(): Semester[] {
  if (cachedData) return cachedData.semesters;
  
  // Try localStorage as fallback for initial load
  try {
    const raw = localStorage.getItem("grade-tracker:semesters:v1");
    if (raw) return JSON.parse(raw) as Semester[];
    
    // Check legacy format
    const legacyRaw = localStorage.getItem("grade-tracker:v1");
    if (legacyRaw) {
      const legacyCourses = JSON.parse(legacyRaw) as Course[];
      if (legacyCourses.length) {
        const migrated: Semester = {
          id: crypto.randomUUID(),
          name: "Sem 1",
          courses: legacyCourses,
        };
        return [migrated];
      }
    }
  } catch {}
  return [];
}

export function saveSemesters(semesters: Semester[]) {
  // Update cache
  if (!cachedData) cachedData = { semesters: [], activeSemesterId: null };
  cachedData.semesters = semesters;
  
  // Save to localStorage as backup
  localStorage.setItem("grade-tracker:semesters:v1", JSON.stringify(semesters));
  
  // Save to file (async)
  saveToFile(cachedData);
}

export function getActiveSemesterId(): string | null {
  if (cachedData) return cachedData.activeSemesterId;
  return localStorage.getItem("grade-tracker:active-semester:v1");
}

export function setActiveSemesterId(id: string) {
  if (!cachedData) cachedData = { semesters: [], activeSemesterId: null };
  cachedData.activeSemesterId = id;
  
  localStorage.setItem("grade-tracker:active-semester:v1", id);
  saveToFile(cachedData);
}

// Initialize cache from file on app start
export async function initializeStore(): Promise<StoredData> {
  cachedData = await loadFromFile();
  
  // If no data in file, migrate from localStorage
  if (cachedData.semesters.length === 0) {
    const localSemesters = loadSemesters();
    const localActiveId = localStorage.getItem("grade-tracker:active-semester:v1");
    if (localSemesters.length) {
      cachedData.semesters = localSemesters;
      cachedData.activeSemesterId = localActiveId;
      await saveToFile(cachedData);
    }
  }
  
  return cachedData;
}

// Get the file location (for display purposes)
export async function getDataLocation(): Promise<string> {
  try {
    return await invoke<string>("get_data_location");
  } catch {
    return "localStorage";
  }
}
