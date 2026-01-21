import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  getCompletedChallenges,
  markChallengeCompleted as saveProgress,
  getStoredSolution,
  syncLocalStorageToAccount,
} from "./progress";

interface ProgressContextType {
  completedChallenges: Set<string>;
  isLoading: boolean;
  markChallengeCompleted: (challengeId: string, solution?: string) => Promise<void>;
  getSolution: (challengeId: string) => Promise<string | null>;
  refreshProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(
  undefined
);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
};

interface ProgressProviderProps {
  children: React.ReactNode;
  userId?: string;
}

export const ProgressProvider = ({
  children,
  userId,
}: ProgressProviderProps) => {
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    setIsLoading(true);
    try {
      const completed = await getCompletedChallenges(userId);
      setCompletedChallenges(completed);
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Sync localStorage to account when user logs in (seamlessly, no UI feedback)
  // The sync function internally tracks which users have been synced via localStorage,
  // so this is safe to call on every userId change
  useEffect(() => {
    if (!userId) return;

    const syncProgress = async () => {
      try {
        const result = await syncLocalStorageToAccount(userId);
        if (result.synced) {
          // Reload progress to reflect synced data
          await loadProgress();
        }
      } catch (error) {
        console.error("Error syncing progress:", error);
      }
    };

    syncProgress();
  }, [userId, loadProgress]);

  const markChallengeCompleted = useCallback(
    async (challengeId: string, solution?: string) => {
      try {
        // Optimistically update local state
        setCompletedChallenges((prev) => new Set([...prev, challengeId]));

        // Save to storage and API
        await saveProgress(challengeId, userId, solution);

        // Reload to ensure sync (in case of any issues)
        await loadProgress();
      } catch (error) {
        console.error("Error marking challenge as completed:", error);
        // Reload to get accurate state
        await loadProgress();
      }
    },
    [userId, loadProgress]
  );

  const getSolution = useCallback(
    async (challengeId: string): Promise<string | null> => {
      return await getStoredSolution(challengeId, userId);
    },
    [userId]
  );

  const refreshProgress = useCallback(async () => {
    await loadProgress();
  }, [loadProgress]);

  // Load progress on mount and when userId changes
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return (
    <ProgressContext.Provider
      value={{
        completedChallenges,
        isLoading,
        markChallengeCompleted,
        getSolution,
        refreshProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};
