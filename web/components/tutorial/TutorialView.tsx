import { useState, useEffect, useRef } from "react";
import { api } from "@/api";
import { InstructionsPanel } from "./InstructionsPanel";
import { TargetOutputPanel } from "./TargetOutputPanel";
import { GellyEditorPanel } from "./GellyEditorPanel";
import { QueryOutputPanel } from "./QueryOutputPanel";
import { CompletionOverlay, type TutorialLevelLink } from "./CompletionOverlay";
import { SchemaModal } from "./SchemaModal";
import {
  normalizeForCompare,
  parseExpectedValue,
  compareValuesSemantically,
} from "./utils";
import { useProgress } from "@/lib/progress-context";

interface Challenge {
  id: string;
  challengeId: number;
  title: string;
  prompt: string;
  backstory: string;
  hint: string;
  hintLink: string;
  solution: string;
  expectedOutput: string;
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
  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const hasTrackedCompletion = useRef(false);
  const { markChallengeCompleted, completedChallenges, getSolution } =
    useProgress();
  const hasLoadedSolution = useRef(false);

  // Check if this challenge was previously completed
  const wasPreviouslyCompleted = completedChallenges.has(challenge.id);

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

      // Use semantic comparison to handle different response structures
      // that return the same data (e.g., different query shapes)
      const expectedValue = parseExpectedValue(challenge.expectedOutput);
      const outputMatchesExpected = compareValuesSemantically(
        response,
        expectedValue
      );

      const passed = queryMatchesSolution || outputMatchesExpected;

      setIsComplete(passed);
      if (passed) {
        onComplete?.();
        // Track completion (only once per challenge) and save the solution
        if (!hasTrackedCompletion.current) {
          hasTrackedCompletion.current = true;
          markChallengeCompleted(challenge.id, gellyCode).catch((error) => {
            console.error("Failed to track challenge completion:", error);
          });
        }
      }

      setRunStatus({
        passed,
        message: passed
          ? "✅ Correct! Your result matches the expected output."
          : "Not quite yet — your output doesn't match the expected output.",
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

  const handleShowSchema = () => {
    setShowSchemaModal(true);
  };

  useEffect(() => {
    if (showSolutionFlash) {
      const timer = setTimeout(() => {
        setShowSolutionFlash(false);
      }, 2000); // Flash for 2 seconds
      return () => clearTimeout(timer);
    }
  }, [showSolutionFlash]);

  // Reset completion tracking and load stored solution when challenge changes
  useEffect(() => {
    hasTrackedCompletion.current = false;
    hasLoadedSolution.current = false;
    // Reset isComplete when challenge changes (don't set it based on previous completion)
    // isComplete should only be true when completed in the current session
    setIsComplete(false);
    // Reset editor to empty
    setGellyCode("");

    // Load stored solution if challenge was previously completed
    if (wasPreviouslyCompleted) {
      getSolution(challenge.id)
        .then((storedSolution) => {
          if (storedSolution && !hasLoadedSolution.current) {
            hasLoadedSolution.current = true;
            setGellyCode(storedSolution);
          }
        })
        .catch((error) => {
          console.error("Failed to load stored solution:", error);
        });
    }
  }, [challenge.id, wasPreviouslyCompleted, getSolution]);

  return (
    <div className="flex flex-col w-full max-w-full h-full overflow-hidden">
      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-2 p-4 overflow-hidden min-h-0 relative">
        {/* Top Left: Instructions Panel */}
        <InstructionsPanel
          challenge={challenge}
          challengeNumber={challengeNumber}
          isComplete={isComplete || wasPreviouslyCompleted}
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
          onShowSchema={handleShowSchema}
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
      {/* Schema Modal */}
      <SchemaModal open={showSchemaModal} onOpenChange={setShowSchemaModal} />
    </div>
  );
}
