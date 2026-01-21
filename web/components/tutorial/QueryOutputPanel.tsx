import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2 } from "lucide-react";

interface RunStatus {
  passed: boolean;
  message: string;
}

interface QueryOutputPanelProps {
  queryOutput: string | null;
  runStatus: RunStatus | null;
}

export function QueryOutputPanel({
  queryOutput,
  runStatus,
}: QueryOutputPanelProps) {
  return (
    <Card className="flex flex-col overflow-hidden border-6 border-primary/60 shadow-lg h-full">
      <CardHeader className="py-2 pb-1.5 border-b">
        <CardTitle className="text-lg font-bold">Query output</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-2 flex flex-col overflow-hidden min-h-0">
        {runStatus && (
          <div
            className={`mb-3 rounded-md border px-3 py-2 text-base flex-shrink-0 ${
              runStatus.passed
                ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300"
                : "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
            }`}
          >
            {runStatus.message}
          </div>
        )}
        {queryOutput === null ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-base">Run a query to see results...</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto min-h-0">
            <pre className="text-sm font-mono bg-muted p-4 rounded-md whitespace-pre-wrap">
              {queryOutput}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

