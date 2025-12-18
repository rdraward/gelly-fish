import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import type { Route } from "./+types/_public.tutorial._index";

export const loader = async ({ context }: Route.LoaderArgs) => {
  const challenges = await context.api.challenge.findMany({
    sort: { createdAt: "Ascending" },
  });

  // Get user's progress (optional - user may not be logged in)
  const userId = context.session?.get("user");
  let userProgress: Record<string, boolean> = {};
  
  if (userId) {
    const progress = await context.api.progress.findMany({
      filter: {
        userId: { equals: userId },
        isComplete: { equals: true },
      },
    });
    userProgress = progress.reduce((acc: Record<string, boolean>, p: any) => {
      if (p.challenge?.id) {
        acc[p.challenge.id] = true;
      }
      return acc;
    }, {} as Record<string, boolean>);
  }

  return {
    challenges,
    userProgress,
  };
};

export default function TutorialIndex({ loaderData }: Route.ComponentProps) {
  const { challenges, userProgress } = loaderData;

  return (
    <div className="min-h-[calc(100vh-8rem)] py-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl font-bold text-white">
              Start your Gelly journey
            </h1>
          </div>
          <p className="text-lg text-white max-w-2xl mx-auto">
            Learn Gadget's powerful Gelly data access language through interactive tutorials. 
            Master queries, filters, and data manipulation one challenge at a time.
          </p>
        </div>

        {/* Challenges Grid */}
        {challenges.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No challenges available yet. Check back soon!</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge: any, index: number) => {
              const isComplete = userProgress[challenge.id] || false;
              const challengeNumber = index + 1;

              return (
                <Card
                  key={challenge.id}
                  className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/30"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        Level {challengeNumber}
                      </Badge>
                      {isComplete ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      Challenge {challengeNumber}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 mt-2">
                      {challenge.prompt.substring(0, 150)}
                      {challenge.prompt.length > 150 ? "..." : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full group/btn">
                      <Link to={`/tutorial/${challenge.id}`}>
                        {isComplete ? "Review Challenge" : "Start Challenge"}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Progress Summary */}
        {Object.keys(userProgress).length > 0 && (
          <Card className="mt-12 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Your Progress</h3>
                <p className="text-sm text-muted-foreground">
                  {Object.keys(userProgress).length} of {challenges.length} challenges completed
                </p>
              </div>
              <div className="text-2xl font-bold text-primary">
                {Math.round((Object.keys(userProgress).length / challenges.length) * 100)}%
              </div>
            </div>
          </Card>
        )}
    </div>
  );
}

