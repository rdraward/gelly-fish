import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export interface TutorialLevelLink {
  id: string; // Internal Gadget ID for progress tracking
  challengeId: number; // Numeric ID for routing
}

interface CompletionOverlayProps {
  isComplete: boolean;
  challengeNumber: number;
  levels: TutorialLevelLink[];
}

export function CompletionOverlay({
  isComplete,
  challengeNumber,
  levels,
}: CompletionOverlayProps) {
  if (!isComplete) return null;

  // Find the next challenge by looking for challengeId = current + 1
  const nextChallenge = levels.find(
    (level) => level.challengeId === challengeNumber + 1
  );

  if (!nextChallenge) return null;

  return (
    <div className="fixed inset-0 lg:absolute lg:inset-0 flex items-center justify-center z-50 pointer-events-none">
      <Link
        to={`/challenge/${nextChallenge.challengeId}`}
        className="pointer-events-auto"
      >
        <Button
          size="lg"
          className="text-xl sm:text-2xl px-6 sm:px-12 py-4 sm:py-8 h-auto shadow-2xl animate-in fade-in zoom-in duration-300"
        >
          Continue to next challenge
          <ArrowRight className="ml-3 h-8 w-8" />
        </Button>
      </Link>
    </div>
  );
}

