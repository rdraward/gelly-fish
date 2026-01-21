import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface TargetOutputPanelProps {
  expectedOutput: string;
  showTargetOutput: boolean;
  onReveal: () => void;
}

export function TargetOutputPanel({
  expectedOutput,
  showTargetOutput,
  onReveal,
}: TargetOutputPanelProps) {
  return (
    <Card className="flex flex-col overflow-hidden border-6 border-primary/60 shadow-lg h-full">
      <CardHeader className="py-2 pb-1.5 border-b">
        <CardTitle className="text-lg font-bold">Target output</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex pb-2 overflow-hidden min-h-0">
        {!showTargetOutput ? (
          <Button
            onClick={onReveal}
            variant="outline"
            size="lg"
            className="w-full h-full text-base"
          >
            <Eye className="mr-2 h-5 w-5" />
            Reveal expected output
          </Button>
        ) : (
          <div className="h-full w-full overflow-auto min-h-0">
            <pre className="text-sm font-mono bg-muted p-4 rounded-md whitespace-pre-wrap">
              {expectedOutput}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
