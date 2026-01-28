import { useState, useEffect, useRef } from "react";
import { BookOpen, Code2, Terminal } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<
    "instructions" | "editor" | "output"
  >("instructions");

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

  // Reset completion tracking and state when challenge changes
  useEffect(() => {
    hasTrackedCompletion.current = false;
    hasLoadedSolution.current = false;
    // Reset isComplete when challenge changes (don't set it based on previous completion)
    // isComplete should only be true when completed in the current session
    setIsComplete(false);
    // Reset editor to empty
    setGellyCode("");
  }, [challenge.id]);

  // Load stored solution if challenge was previously completed
  // This is separate from the reset effect to avoid resetting isComplete
  // when wasPreviouslyCompleted changes (which happens after successful completion)
  useEffect(() => {
    if (wasPreviouslyCompleted && !hasLoadedSolution.current) {
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

  // Auto-switch to output tab on mobile when query completes
  useEffect(() => {
    if (queryOutput !== null) {
      setActiveTab("output");
    }
  }, [queryOutput]);

  return (
    <div className="flex flex-col w-full max-w-full h-full">
      {/* Mobile layout: single panel + bottom tab bar */}
      <div className="lg:hidden flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto p-2">
          {activeTab === "instructions" && (
            <InstructionsPanel
              challenge={challenge}
              challengeNumber={challengeNumber}
              isComplete={isComplete || wasPreviouslyCompleted}
            />
          )}
          {activeTab === "editor" && (
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
          )}
          {activeTab === "output" && (
            <div className="flex flex-col gap-2">
              <TargetOutputPanel
                expectedOutput={challenge.expectedOutput}
                showTargetOutput={showTargetOutput}
                onReveal={handleRevealOutput}
              />
              <QueryOutputPanel
                queryOutput={queryOutput}
                runStatus={runStatus}
              />
            </div>
          )}
        </div>
        {/* Bottom tab bar */}
        <div className="flex border-4 border-b-0 border-primary/60 bg-card shrink-0 rounded-t-xl">
          {(
            [
              { key: "instructions" as const, label: "Info", Icon: BookOpen },
              { key: "editor" as const, label: "Editor", Icon: Code2 },
              { key: "output" as const, label: "Output", Icon: Terminal },
            ] as const
          ).map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
                activeTab === key
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${activeTab === key ? "" : "opacity-60"}`}
              />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop layout: 2x2 grid */}
      <div className="hidden lg:grid grid-cols-2 grid-rows-2 gap-2 p-4 flex-1 min-h-0 overflow-hidden relative">
        <InstructionsPanel
          challenge={challenge}
          challengeNumber={challengeNumber}
          isComplete={isComplete || wasPreviouslyCompleted}
        />

        <TargetOutputPanel
          expectedOutput={challenge.expectedOutput}
          showTargetOutput={showTargetOutput}
          onReveal={handleRevealOutput}
        />

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

        <QueryOutputPanel queryOutput={queryOutput} runStatus={runStatus} />

        <CompletionOverlay
          isComplete={isComplete}
          challengeNumber={challengeNumber}
          levels={levels}
        />
      </div>

      {/* Mobile completion overlay */}
      <div className="lg:hidden">
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
