import { TutorialView } from "@/components/tutorial/TutorialView";
import type { Route } from "./+types/_public.challenge.$challengeId";

export const loader = async ({ params, context }: Route.LoaderArgs) => {
  const { challengeId } = params;
  
  if (!challengeId) {
    throw new Response("Challenge ID required", { status: 400 });
  }

  // Find challenge by numeric challengeId field
  const challenge = await context.api.challenge.findFirst({
    filter: { challengeId: { equals: Number(challengeId) } },
  });
  
  if (!challenge) {
    throw new Response("Challenge not found", { status: 404 });
  }

  // Get all challenges sorted by challengeId
  const allChallenges = await context.api.challenge.findMany({
    sort: { challengeId: "Ascending" },
  });

  // Get user info if logged in (optional)
  const userId = context.session?.get("user");
  const user = userId ? await context.api.user.findOne(userId) : undefined;

  return {
    challenge,
    challengeNumber: challenge.challengeId,
    totalChallenges: allChallenges.length,
    levels: allChallenges.map((c: any) => ({
      id: c.id,
      challengeId: c.challengeId,
    })),
    user,
  };
};

export default function TutorialChallenge({ loaderData }: Route.ComponentProps) {
  const { challenge, challengeNumber, totalChallenges, levels, user } = loaderData;

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="flex-1 overflow-hidden">
        <TutorialView
          key={challenge.id}
          challenge={{
            id: challenge.id,
            challengeId: challenge.challengeId,
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

