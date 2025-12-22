import { api } from "@/api";

const STORAGE_KEY = "gelly-wiggle-completed-challenges";
const SOLUTIONS_STORAGE_KEY = "gelly-wiggle-challenge-solutions";

/**
 * Get completed challenge IDs from browser storage
 */
export function getCompletedChallengesFromStorage(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const ids = JSON.parse(stored) as string[];
      return new Set(ids);
    }
  } catch (error) {
    console.error("Error reading completed challenges from storage:", error);
  }
  return new Set<string>();
}

/**
 * Save completed challenge ID to browser storage
 */
export function saveCompletedChallengeToStorage(challengeId: string): void {
  try {
    const completed = getCompletedChallengesFromStorage();
    completed.add(challengeId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completed)));
  } catch (error) {
    console.error("Error saving completed challenge to storage:", error);
  }
}

/**
 * Save solution to browser storage
 */
export function saveSolutionToStorage(
  challengeId: string,
  solution: string
): void {
  try {
    const stored = localStorage.getItem(SOLUTIONS_STORAGE_KEY);
    const solutions = stored
      ? (JSON.parse(stored) as Record<string, string>)
      : {};
    solutions[challengeId] = solution;
    localStorage.setItem(SOLUTIONS_STORAGE_KEY, JSON.stringify(solutions));
  } catch (error) {
    console.error("Error saving solution to storage:", error);
  }
}

/**
 * Get solution from browser storage
 */
export function getSolutionFromStorage(challengeId: string): string | null {
  try {
    const stored = localStorage.getItem(SOLUTIONS_STORAGE_KEY);
    if (stored) {
      const solutions = JSON.parse(stored) as Record<string, string>;
      return solutions[challengeId] || null;
    }
  } catch (error) {
    console.error("Error reading solution from storage:", error);
  }
  return null;
}

/**
 * Save progress to Gadget API if user is signed in
 */
export async function saveProgressToAPI(
  challengeId: string,
  userId: string,
  solution: string
): Promise<void> {
  try {
    await api.progress.upsert({
      challenge: { _link: challengeId },
      user: { _link: userId },
      isComplete: true,
      solution: solution,
      on: ["challenge", "user"],
    });
  } catch (error) {
    console.error("Error saving progress to API:", error);
    throw error;
  }
}

/**
 * Get solution from Gadget API
 */
export async function getSolutionFromAPI(
  challengeId: string,
  userId: string
): Promise<string | null> {
  try {
    const progressRecord = await api.progress.maybeFindFirst({
      filter: {
        challengeId: { equals: challengeId },
        userId: { equals: userId },
        isComplete: { equals: true },
      },
      select: {
        solution: true,
      },
    });

    return progressRecord?.solution || null;
  } catch (error) {
    console.error("Error fetching solution from API:", error);
    return null;
  }
}

/**
 * Get completed challenge IDs from Gadget API
 */
export async function getCompletedChallengesFromAPI(
  userId: string
): Promise<Set<string>> {
  try {
    const progressRecords = await api.progress.findMany({
      filter: {
        userId: { equals: userId },
        isComplete: { equals: true },
      },
    });

    const challengeIds = progressRecords
      .map((p) => p.challengeId)
      .filter((id): id is string => !!id);

    return new Set(challengeIds);
  } catch (error) {
    console.error("Error fetching completed challenges from API:", error);
    return new Set<string>();
  }
}

/**
 * Mark a challenge as completed
 * Saves to localStorage and to Gadget API if user is signed in
 */
export async function markChallengeCompleted(
  challengeId: string,
  userId?: string,
  solution?: string
): Promise<void> {
  // Always save to browser storage
  saveCompletedChallengeToStorage(challengeId);

  // Save solution to browser storage if provided
  if (solution) {
    saveSolutionToStorage(challengeId, solution);
  }

  // Save to API if user is signed in and solution is provided
  // (solution is required in the API schema)
  if (userId && solution) {
    await saveProgressToAPI(challengeId, userId, solution);
  }
}

/**
 * Get stored solution for a challenge
 * Checks both localStorage and API (if user is signed in)
 */
export async function getStoredSolution(
  challengeId: string,
  userId?: string
): Promise<string | null> {
  // Check localStorage first
  const storageSolution = getSolutionFromStorage(challengeId);
  if (storageSolution) {
    return storageSolution;
  }

  // Check API if user is signed in
  if (userId) {
    const apiSolution = await getSolutionFromAPI(challengeId, userId);
    if (apiSolution) {
      // Also save to localStorage for faster access next time
      saveSolutionToStorage(challengeId, apiSolution);
      return apiSolution;
    }
  }

  return null;
}

/**
 * Get all completed challenge IDs
 * Combines data from localStorage and API (if user is signed in)
 */
export async function getCompletedChallenges(
  userId?: string
): Promise<Set<string>> {
  const storageIds = getCompletedChallengesFromStorage();

  if (userId) {
    // If signed in, also fetch from API and merge
    const apiIds = await getCompletedChallengesFromAPI(userId);
    // Merge both sets
    return new Set([...storageIds, ...apiIds]);
  }

  return storageIds;
}

/**
 * Check if a specific challenge is completed
 */
export async function isChallengeCompleted(
  challengeId: string,
  userId?: string
): Promise<boolean> {
  const completed = await getCompletedChallenges(userId);
  return completed.has(challengeId);
}
