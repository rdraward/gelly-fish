import { useState, useEffect } from "react";
import { api } from "@/api";
import { InstructionsPanel } from "./InstructionsPanel";
import { TargetOutputPanel } from "./TargetOutputPanel";
import { GellyEditorPanel } from "./GellyEditorPanel";
import { QueryOutputPanel } from "./QueryOutputPanel";
import { CompletionOverlay } from "./CompletionOverlay";
import { normalizeForCompare, parseExpectedValue } from "./utils";

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

export function TutorialView({
  challenge,
  challengeNumber = 1,
  onComplete,
  user,
  levels = [],
}: TutorialViewProps) {
  const [gellyCode, setGellyCode] = useState("");
  const [queryOutput, setQueryOutput] = useState<string | null>(null);
  const [runStatus, setRunStatus] = useState<{
    passed: boolean;
    message: string;
  } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showTargetOutput, setShowTargetOutput] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showSolutionFlash, setShowSolutionFlash] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setQueryOutput(null);
    setRunStatus(null);

    try {
      const response = await api.view(gellyCode);
      // Display: keep JSON (nice for debugging), but grade on values only
      const displayText =
        typeof response === "string"
          ? response
          : response == null
            ? ""
            : JSON.stringify(response, null, 2);
      setQueryOutput(displayText);

      const queryMatchesSolution =
        normalizeForCompare(gellyCode) ===
        normalizeForCompare(challenge.solution);
      const outputMatchesExpected =
        normalizeForCompare(response) ===
        normalizeForCompare(parseExpectedValue(challenge.expectedOutput));
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
      setRunStatus({
        passed: false,
        message: "Error running query (see output).",
      });
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

  const handleHideHint = () => {
    setShowHint(false);
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
    <div className="flex flex-col w-full max-w-full h-full overflow-hidden">
      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-4 p-4 overflow-hidden min-h-0 relative">
        {/* Top Left: Instructions Panel */}
        <InstructionsPanel
          challenge={challenge}
          challengeNumber={challengeNumber}
          isComplete={isComplete}
        />

        {/* Top Right: Target Output Panel */}
        <TargetOutputPanel
          expectedOutput={challenge.expectedOutput}
          showTargetOutput={showTargetOutput}
          onReveal={handleRevealOutput}
        />

        {/* Bottom Left: Gelly Editor Panel */}
        <GellyEditorPanel
          challenge={challenge}
          gellyCode={gellyCode}
          onCodeChange={setGellyCode}
          showHint={showHint}
          onShowHint={handleShowHint}
          onHideHint={handleHideHint}
          onRun={handleRun}
          onShowSolution={handleShowSolution}
          isRunning={isRunning}
          showSolutionFlash={showSolutionFlash}
        />

        {/* Bottom Right: Query Output Panel */}
        <QueryOutputPanel queryOutput={queryOutput} runStatus={runStatus} />

        {/* Completion Overlay */}
        <CompletionOverlay
          isComplete={isComplete}
          challengeNumber={challengeNumber}
          levels={levels}
        />
      </div>
    </div>
  );
}
