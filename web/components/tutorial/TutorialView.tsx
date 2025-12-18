import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lightbulb, CheckCircle2, Eye, Code2, Play, X, ArrowRight } from "lucide-react";
import { api } from "@/api";

interface Challenge {
  id: string;
  title: string;
  prompt: string;
  backstory: string;
  hint: string;
  hintLink: string;
  solution: string;
  expectedOutput: string;
}

interface TutorialLevelLink {
  id: string;
  number: number;
}

interface TutorialViewProps {
  challenge: Challenge;
  challengeNumber?: number;
  totalChallenges?: number;
  onComplete?: () => void;
  user?: any;
  levels?: TutorialLevelLink[];
}

export function TutorialView({ challenge, challengeNumber = 1, onComplete, user, levels = [] }: TutorialViewProps) {
  const [gellyCode, setGellyCode] = useState("");
  const [queryOutput, setQueryOutput] = useState<string | null>(null);
  const [runStatus, setRunStatus] = useState<{ passed: boolean; message: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showTargetOutput, setShowTargetOutput] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showSolutionFlash, setShowSolutionFlash] = useState(false);

  const unwrapSingleValue = (value: unknown): unknown => {
    if (value == null) return value;
    if (Array.isArray(value) && value.length === 1) return value[0];
    if (typeof value === "object") {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 1) return entries[0]![1];
    }
    return value;
  };

  const parseExpectedValue = (expected: string): unknown => {
    const trimmed = expected.trim();

    // Try JSON first (lets you store expected outputs as JSON objects/arrays too)
    try {
      return JSON.parse(trimmed);
    } catch {
      // fall through
    }

    // Handle "key: value" style expected outputs by comparing only the value
    const firstColon = trimmed.indexOf(":");
    if (firstColon !== -1) {
      return trimmed.slice(firstColon + 1).trim();
    }

    return trimmed;
  };

  const normalizeForCompare = (value: unknown) => {
    const unwrapped = unwrapSingleValue(value);
    const str =
      typeof unwrapped === "string"
        ? unwrapped
        : unwrapped == null
          ? ""
          : typeof unwrapped === "object"
            ? JSON.stringify(unwrapped, null, 2)
            : String(unwrapped);

    return (
      str
        // normalize newlines
        .replace(/\r\n/g, "\n")
        // trim each line + drop extra empty lines at ends
        .split("\n")
        .map((l) => l.trimEnd())
        .join("\n")
        .trim()
    );
  };

  const handleRun = async () => {
    setIsRunning(true);
    setQueryOutput(null);
    setRunStatus(null);

    try {
      const response = await api.view(gellyCode);
      // Display: keep JSON (nice for debugging), but grade on values only
      const displayText =
        typeof response === "string" ? response : response == null ? "" : JSON.stringify(response, null, 2);
      setQueryOutput(displayText);

      const queryMatchesSolution = normalizeForCompare(gellyCode) === normalizeForCompare(challenge.solution);
      const outputMatchesExpected = normalizeForCompare(response) === normalizeForCompare(parseExpectedValue(challenge.expectedOutput));
      const passed = queryMatchesSolution || outputMatchesExpected;

      setIsComplete(passed);
      if (passed) onComplete?.();

      setRunStatus({
        passed,
        message: passed
          ? "✅ Correct! Your result matches the expected output."
          : "Not quite yet — your output doesn’t match the expected output.",
      });
    } catch (err: any) {
      const message = err?.message ? String(err.message) : "Unknown error";
      setIsComplete(false);
      setQueryOutput(`Error running query:\n${message}`);
      setRunStatus({ passed: false, message: "Error running query (see output)." });
    } finally {
      setIsRunning(false);
    }
  };

  const handleRevealOutput = () => {
    setShowTargetOutput(true);
  };

  const handleShowHint = () => {
    setShowHint(true);
  };

  const handleShowSolution = () => {
    setGellyCode(challenge.solution);
    setShowSolutionFlash(true);
  };

  useEffect(() => {
    if (showSolutionFlash) {
      const timer = setTimeout(() => {
        setShowSolutionFlash(false);
      }, 2000); // Flash for 2 seconds
      return () => clearTimeout(timer);
    }
  }, [showSolutionFlash]);

  return (
    <div
      className="flex flex-col w-full max-w-full h-full overflow-hidden"
    >
      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-4 p-4 overflow-hidden min-h-0 relative">
        {/* Top Left: Instructions Panel */}
        <Card className="flex flex-col overflow-hidden border-2 border-primary/20 shadow-lg h-full">
          <CardHeader className="py-2 pb-1.5 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="font-bold">Challenge {challengeNumber}: {challenge.title}</span>
              {isComplete && <CheckCircle2 className="h-4 w-4 text-green-500" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-2">
            <div className="h-full pr-4">
              <div className="space-y-4 text-base leading-relaxed">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {challenge.backstory && (
                    <p className="text-foreground whitespace-pre-wrap mb-4">{challenge.backstory}</p>
                  )}
                  <p className="text-foreground whitespace-pre-wrap font-bold">{challenge.prompt}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Right: Target Output Panel */}
        <Card className="flex flex-col overflow-hidden border-2 border-primary/20 shadow-lg h-full">
          <CardHeader className="py-2 pb-1.5 border-b">
            <CardTitle className="text-lg font-bold">Target output</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex pb-2">
            {!showTargetOutput ? (
              <Button
                onClick={handleRevealOutput}
                variant="outline"
                size="lg"
                className="w-full h-full text-base"
              >
                <Eye className="mr-2 h-5 w-5" />
                Reveal expected output
              </Button>
            ) : (
              <div className="h-full w-full overflow-hidden">
                <pre className="text-sm font-mono bg-muted p-4 rounded-md whitespace-pre-wrap overflow-hidden max-h-full">
                  {challenge.expectedOutput}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bottom Left: Gelly Editor Panel */}
        <Card className="flex flex-col overflow-hidden border-2 border-primary/20 shadow-lg h-full">
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
                onChange={(e) => setGellyCode(e.target.value)}
                placeholder="-- Enter your Gelly query here&#10;-- view { <your query> }"
                className={`h-full font-mono text-base resize-none transition-colors duration-300 ${
                  showSolutionFlash ? "border-green-500/30 ring-2 ring-green-500/20" : ""
                }`}
              />
            </div>
            {showHint && (
              <Alert className="border-amber-500/30 bg-amber-500/10">
                <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="text-amber-800 dark:text-amber-300">
                  <div className="flex items-start justify-between gap-2">
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
                      onClick={() => setShowHint(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={handleRun}
                disabled={isRunning || !gellyCode.trim()}
                className="flex-1 min-w-[120px]"
              >
                <Play className="mr-2 h-4 w-4" />
                {isRunning ? "Running..." : "Run"}
              </Button>
              <Button variant="outline" onClick={handleShowHint}>
                <Lightbulb className="mr-2 h-4 w-4" />
                {showHint ? "Hide Hint" : "Hint"}
              </Button>
              <Button variant="outline" onClick={handleShowSolution}>
                <Code2 className="mr-2 h-4 w-4" />
                Solution
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Right: Query Output Panel */}
        <Card className="flex flex-col overflow-hidden border-2 border-primary/20 shadow-lg h-full">
          <CardHeader className="py-2 pb-1.5 border-b">
            <CardTitle className="text-lg font-bold">Query output</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-2">
            {runStatus && (
              <div
                className={`mb-3 rounded-md border px-3 py-2 text-base ${
                  runStatus.passed
                    ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
                }`}
              >
                {runStatus.message}
              </div>
            )}
            {queryOutput === null ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-base">Run a query to see results...</p>
                </div>
              </div>
            ) : (
              <div className="h-full overflow-hidden">
                <pre className="text-sm font-mono bg-muted p-4 rounded-md whitespace-pre-wrap overflow-hidden max-h-full">
                  {queryOutput}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completion Overlay Button - Centered over grid intersection */}
        {isComplete && (() => {
          const nextChallenge = levels.find((level) => level.number === challengeNumber + 1);
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
        })()}
      </div>
    </div>
  );
}

