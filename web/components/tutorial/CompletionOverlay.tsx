import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface TutorialLevelLink {
  id: string;
  number: number;
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

  const nextChallenge = levels.find(
    (level) => level.number === challengeNumber + 1
  );

  if (!nextChallenge) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
      <Link
        to={`/challenge/${nextChallenge.id}`}
        className="pointer-events-auto"
      >
        <Button
          size="lg"
          className="text-2xl px-12 py-8 h-auto shadow-2xl animate-in fade-in zoom-in duration-300"
        >
          Continue to next challenge
          <ArrowRight className="ml-3 h-8 w-8" />
        </Button>
      </Link>
    </div>
  );
}

