import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Lightbulb, CheckCircle2, Eye, Code2, Play } from "lucide-react";
import { api } from "@/api";

interface Challenge {
  id: string;
  prompt: string;
  hint: string;
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
  const [showSolution, setShowSolution] = useState(false);
  const [showTargetOutput, setShowTargetOutput] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

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
    setShowSolution(true);
  };

  return (
    <div
      className="flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/20 w-full max-w-full h-full overflow-hidden"
    >
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm z-10 px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <nav className="flex items-center gap-1 overflow-x-auto whitespace-nowrap min-w-0">
              {levels.map((lvl) => {
                const isActive = lvl.id === challenge.id;
                return (
                  <Button
                    key={lvl.id}
                    asChild
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="h-8 px-2"
                  >
                    <Link to={`/tutorial/${lvl.id}`} aria-current={isActive ? "page" : undefined}>
                      {lvl.number}
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 overflow-hidden min-h-0">
        {/* Top Left: Instructions Panel */}
        <Card className="flex flex-col overflow-hidden border-2 border-primary/20 shadow-lg">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg font-bold">Level {challengeNumber}: The Gelly Adventure</span>
              {isComplete && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-6">
            <div className="h-full pr-4">
              <div className="space-y-4 text-sm leading-relaxed">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-foreground whitespace-pre-wrap line-clamp-10">{challenge.prompt}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Right: Target Output Panel */}
        <Card className="flex flex-col overflow-hidden border-2 border-primary/20 shadow-lg">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg font-bold">Target Output</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center p-6">
            {!showTargetOutput ? (
              <Button
                onClick={handleRevealOutput}
                variant="outline"
                size="lg"
                className="w-full h-20 text-base"
              >
                <Eye className="mr-2 h-5 w-5" />
                Reveal Output
              </Button>
            ) : (
              <div className="h-full w-full overflow-hidden">
                <pre className="text-xs font-mono bg-muted p-4 rounded-md whitespace-pre-wrap overflow-hidden max-h-full">
                  {challenge.expectedOutput}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bottom Left: Gelly Editor Panel */}
        <Card className="flex flex-col overflow-hidden border-2 border-primary/20 shadow-lg">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Gelly Editor
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 p-6">
            <div className="flex-1 min-h-0">
              <Textarea
                value={gellyCode}
                onChange={(e) => setGellyCode(e.target.value)}
                placeholder="-- Enter your Gelly query here&#10;-- Example: findMany(user)"
                className="h-full font-mono text-sm resize-none"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={handleRun}
                disabled={isRunning || !gellyCode.trim()}
                className="flex-1 min-w-[120px]"
              >
                <Play className="mr-2 h-4 w-4" />
                {isRunning ? "Running..." : "Run"}
              </Button>
              <Dialog open={showHint} onOpenChange={setShowHint}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={handleShowHint}>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Hint
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Hint</DialogTitle>
                    <DialogDescription className="whitespace-pre-wrap pt-4">
                      {challenge.hint}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Dialog open={showSolution} onOpenChange={setShowSolution}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={handleShowSolution}>
                    <Code2 className="mr-2 h-4 w-4" />
                    Solution
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Solution</DialogTitle>
                    <DialogDescription className="pt-4">
                      <pre className="text-xs font-mono bg-muted p-4 rounded-md whitespace-pre-wrap overflow-auto">
                        {challenge.solution}
                      </pre>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {gellyCode.trim() ? "Ready to run!" : "Enter your Gelly query above"}
            </p>
          </CardContent>
        </Card>

        {/* Bottom Right: Query Output Panel */}
        <Card className="flex flex-col overflow-hidden border-2 border-primary/20 shadow-lg">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg font-bold">Query Output</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-6">
            {runStatus && (
              <div
                className={`mb-3 rounded-md border px-3 py-2 text-sm ${
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
                  <p className="text-sm">Run a query to see results...</p>
                </div>
              </div>
            ) : (
              <div className="h-full overflow-hidden">
                <pre className="text-xs font-mono bg-muted p-4 rounded-md whitespace-pre-wrap overflow-hidden max-h-full">
                  {queryOutput}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

