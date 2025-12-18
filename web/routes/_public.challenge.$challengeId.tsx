import { TutorialView } from "@/components/tutorial/TutorialView";
import { useParams } from "react-router";
import type { Route } from "./+types/_public.challenge.$challengeId";

export const loader = async ({ params, context }: Route.LoaderArgs) => {
  const { challengeId } = params;
  
  if (!challengeId) {
    throw new Response("Challenge ID required", { status: 400 });
  }

  const challenge = await context.api.challenge.findOne(challengeId);
  
  if (!challenge) {
    throw new Response("Challenge not found", { status: 404 });
  }

  // Get all challenges to determine position
  const allChallenges = await context.api.challenge.findMany({
    sort: { createdAt: "Ascending" },
  });

  const challengeIndex = allChallenges.findIndex((c: any) => c.id === challengeId);
  const challengeNumber = challengeIndex >= 0 ? challengeIndex + 1 : 1;

  // Get user info if logged in (optional)
  const userId = context.session?.get("user");
  const user = userId ? await context.api.user.findOne(userId) : undefined;

  return {
    challenge,
    challengeNumber,
    totalChallenges: allChallenges.length,
    levels: allChallenges.map((c: any, index: number) => ({
      id: c.id,
      number: index + 1,
    })),
    user,
  };
};

export default function TutorialChallenge({ loaderData }: Route.ComponentProps) {
  const { challenge, challengeNumber, totalChallenges, levels, user } = loaderData;
  const params = useParams();
  
  // Force re-render when challengeId changes
  const challengeId = params.challengeId;

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="flex-1 overflow-hidden">
        <TutorialView
          key={challenge.id}
          challenge={{
            id: challenge.id,
            prompt: challenge.prompt,
            backstory: challenge.backstory,
            title: challenge.title,
            hint: challenge.hint,
            hintLink: challenge.hintLink,
            solution: challenge.solution,
            expectedOutput: challenge.expectedOutput,
          }}
          challengeNumber={challengeNumber}
          totalChallenges={totalChallenges}
          levels={levels}
          user={user}
        />
      </div>
    </div>
  );
}

