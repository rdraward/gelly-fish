import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface Challenge {
  title: string;
  backstory: string;
  prompt: string;
}

interface InstructionsPanelProps {
  challenge: Challenge;
  challengeNumber: number;
  isComplete: boolean;
}

export function InstructionsPanel({
  challenge,
  challengeNumber,
  isComplete,
}: InstructionsPanelProps) {
  return (
    <Card className="flex flex-col overflow-hidden border-6 border-primary/60 shadow-lg h-full">
      <CardHeader className="py-2 pb-1.5 border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="font-bold">
            Challenge {challengeNumber}: {challenge.title}
          </span>
          {isComplete && (
            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <div className="h-full pr-4">
          <div className="space-y-4 text-base leading-relaxed">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {challenge.backstory && (
                <p className="text-foreground whitespace-pre-wrap mb-4">
                  {challenge.backstory}
                </p>
              )}
              <p className="text-foreground whitespace-pre-wrap font-bold">
                {challenge.prompt}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

