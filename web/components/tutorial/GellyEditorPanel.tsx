import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lightbulb, Code2, Play, X, Database } from "lucide-react";

interface Challenge {
  hint: string;
  hintLink: string;
  solution: string;
}

interface GellyEditorPanelProps {
  challenge: Challenge;
  gellyCode: string;
  onCodeChange: (code: string) => void;
  showHint: boolean;
  onShowHint: () => void;
  onHideHint: () => void;
  onRun: () => void;
  onShowSolution: () => void;
  onShowSchema: () => void;
  isRunning: boolean;
  showSolutionFlash: boolean;
}

export function GellyEditorPanel({
  challenge,
  gellyCode,
  onCodeChange,
  showHint,
  onShowHint,
  onHideHint,
  onRun,
  onShowSolution,
  onShowSchema,
  isRunning,
  showSolutionFlash,
}: GellyEditorPanelProps) {
  return (
    <Card className="flex flex-col overflow-hidden border-6 border-primary/60 shadow-lg h-full">
      <CardHeader className="py-2 pb-1.5 border-b">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Code2 className="h-4 w-4" />
          Gelly editor
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 pb-2">
        <div className="flex-1 min-h-0">
          <Textarea
            value={gellyCode}
            onChange={(e) => onCodeChange(e.target.value)}
            placeholder="-- Enter your Gelly query here&#10;-- view { <your query> }"
            className={`h-full font-mono text-base resize-none transition-colors duration-300 ${
              showSolutionFlash
                ? "border-green-500/30 ring-2 ring-green-500/20"
                : ""
            }`}
          />
        </div>
        {showHint && (
          <Alert className="border-amber-500/30 bg-amber-500/10">
            <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-300 w-full !flex !flex-col">
              <div className="flex items-start justify-between gap-2 w-full">
                <div className="flex-1 whitespace-pre-wrap">
                  {challenge.hint}
                  {challenge.hintLink && (
                    <>
                      {" "}
                      <a
                        href={challenge.hintLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-700 dark:text-amber-300 hover:underline font-medium"
                      >
                        Read the docs
                      </a>
                    </>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
                  onClick={onHideHint}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={onRun}
            disabled={isRunning || !gellyCode.trim()}
            className="flex-1 min-w-[120px]"
          >
            <Play className="mr-2 h-4 w-4" />
            {isRunning ? "Running..." : "Run"}
          </Button>
          <Button variant="outline" onClick={showHint ? onHideHint : onShowHint} className="min-w-[120px]">
            <Lightbulb className="mr-2 h-4 w-4" />
            {showHint ? "Hide Hint" : "Hint"}
          </Button>
          <Button variant="outline" onClick={onShowSolution} className="min-w-[120px]">
            <Code2 className="mr-2 h-4 w-4" />
            Solution
          </Button>
          <Button variant="outline" onClick={onShowSchema} className="min-w-[120px]">
            <Database className="mr-2 h-4 w-4" />
            Schema
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

