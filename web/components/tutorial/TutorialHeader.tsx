import { Link } from "react-router";
import { GellyLogo } from "@/components/shared/GellyLogo";

interface TutorialLevelLink {
  id: string;
  number: number;
}

interface TutorialHeaderProps {
  levels: TutorialLevelLink[];
  currentChallengeId?: string;
}

export function TutorialHeader({ levels, currentChallengeId }: TutorialHeaderProps) {
  return (
    <header className="z-10 px-6 py-3 bg-white rounded">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <nav className="flex items-center gap-2 overflow-x-auto whitespace-nowrap min-w-0">
            {levels.map((lvl) => {
              const isActive = lvl.id === currentChallengeId;
              return (
                <Link
                  key={lvl.id}
                  to={`/challenge/${lvl.id}`}
                  aria-current={isActive ? "page" : undefined}
                  className="inline-block"
                >
                  <GellyLogo height={64} number={lvl.number} hideCircle />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

