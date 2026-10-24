import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Scale, Sparkles, AlertCircle, ArrowLeft, Menu, X, BookmarkCheck, Award } from "lucide-react";
import CreateDecision from "./components/CreateDecision";
import DecisionHistory from "./components/DecisionHistory";
import AnalysisResults from "./components/AnalysisResults";
import { Decision } from "./types";

const LOADING_PHASES = [
  "Formulating critical pathways & strategic options...",
  "Calibrating side-by-side comparison indices...",
  "Running SWOT structural assessments for each path...",
  "Synthesizing weighted impact equations for pros & cons...",
  "Formulating the ultimate optimal verdict with Gemini...",
];

export default function App() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [activeDecisionId, setActiveDecisionId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhaseIndex, setLoadingPhaseIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load decision history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("tiebreaker_decisions");
      if (stored) {
        const parsed = JSON.parse(stored) as Decision[];
        setDecisions(parsed);
        // Default to showing the most recent decision if it has results
        if (parsed.length > 0) {
          const firstResult = parsed.find((d) => d.result);
          if (firstResult) {
            setActiveDecisionId(firstResult.id);
          }
        }
      }
    } catch (e) {
      console.error("Failed to load decisions from state", e);
    }
  }, []);

  // Save history to localStorage on change
  const saveDecisions = (newDecisions: Decision[]) => {
    setDecisions(newDecisions);
    localStorage.setItem("tiebreaker_decisions", JSON.stringify(newDecisions));
  };

  // Loading phase cycle timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingPhaseIndex((prev) => (prev + 1) % LOADING_PHASES.length);
      }, 2500);
    } else {
      setLoadingPhaseIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Execute Gemini AI analysis of the decision
  const handleCalculateTiebreaker = async (title: string, optionA: string, optionB: string) => {
    setIsLoading(true);
    setError(null);
    setLoadingPhaseIndex(0);

    try {
      const response = await fetch("/api/tiebreaker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          optionA,
          optionB,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || data.details || "API returned an unexpected response.");
      }

      const newDecision: Decision = {
        id: "dec-" + Date.now(),
        title: title,
        optionAName: data.optionA.name,
        optionBName: data.optionB.name,
        createdAt: new Date().toISOString(),
        isBookmarked: false,
        result: data,
      };

      const updated = [newDecision, ...decisions];
      saveDecisions(updated);
      setActiveDecisionId(newDecision.id);
      setIsSidebarOpen(false); // close sidebar drawer on mobile
    } catch (err: any) {
      console.error("Decision generation failure:", err);
      setError(err.message || "An unexpected error occurred while communicating with Gemini.");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle bookmark flag
  const handleToggleBookmark = (id: string) => {
    const updated = decisions.map((d) => {
      if (d.id === id) {
        return { ...d, isBookmarked: !d.isBookmarked };
      }
      return d;
    });
    saveDecisions(updated);
  };

  // Delete decision from history
  const handleDeleteDecision = (id: string) => {
    const updated = decisions.filter((d) => d.id !== id);
    saveDecisions(updated);
    if (activeDecisionId === id) {
      const remainingAnalyzed = updated.find((d) => d.result);
      setActiveDecisionId(remainingAnalyzed?.id);
    }
  };

  const activeDecision = decisions.find((d) => d.id === activeDecisionId);

  return (
    <div id="tiebreaker-root-container" className="h-screen w-full flex overflow-hidden font-sans text-slate-800 bg-slate-50">
      
      {/* Mobile Top Header (hidden on desktop) */}
      <div className="lg:hidden absolute top-0 left-0 right-0 h-14 bg-slate-900 text-white flex items-center justify-between px-4 z-40 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-500 rounded flex items-center justify-center">
            <div className="w-3.5 h-3.5 bg-white rotate-45"></div>
          </div>
          <span className="font-bold text-sm tracking-tight">Tiebreaker Panel</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveDecisionId(undefined)}
            className="p-1.5 bg-slate-800 text-slate-200 rounded text-[10px] font-bold uppercase tracking-wider"
          >
            + New
          </button>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 text-slate-300 hover:text-white"
            aria-label="Toggle menu log"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* LEFT SIDEBAR PANEL: Persistent on desktop sizes, sliding drawer on mobile */}
      <aside
        id="side-drawer"
        className={`w-72 bg-slate-900 flex flex-col shrink-0 border-r border-slate-800/80 z-30 transition-transform duration-300 lg:translate-x-0 absolute lg:static h-full ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Title / Brand Segment (matches design head exactly) */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between mt-14 lg:mt-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/10">
              <div className="w-4 h-4 bg-white rotate-45"></div>
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight block">Tiebreaker</span>
              <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest font-mono">
                AI Assessment Desk
              </p>
            </div>
          </div>
          
          {activeDecisionId && (
            <button
              onClick={() => {
                setActiveDecisionId(undefined);
                setIsSidebarOpen(false);
              }}
              className="text-[9px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2.5 py-1 rounded-md uppercase tracking-wider transition-colors shadow-sm"
              title="New analysis"
            >
              New
            </button>
          )}
        </div>

        {/* List content of decisiones (Sleek dark theme) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <DecisionHistory
            decisions={decisions}
            activeDecisionId={activeDecisionId}
            onSelect={(id) => {
              setActiveDecisionId(id);
              setIsSidebarOpen(false);
            }}
            onDelete={handleDeleteDecision}
            onToggleBookmark={handleToggleBookmark}
          />
        </div>

        {/* Sidebar Footer element (matching layout with high-accuracy status indicator) */}
        <div className="mt-auto p-5 border-t border-slate-800 text-slate-400 text-xs flex justify-between items-center font-mono">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-slate-400 text-xs">AI Status: active</span>
          </div>
          <span className="text-slate-500 text-[10px] bg-slate-950/40 p-1 px-2 rounded">v3.5 GCore</span>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-20 transition-opacity"
        />
      )}

      {/* MAIN CONTENT REGION */}
      <main className="flex-1 flex flex-col p-5 sm:p-8 md:p-10 gap-6 overflow-y-auto mt-14 lg:mt-0 min-w-0">
        
        {/* Dynamic header row aligning with the design HTML structure */}
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Decision Analysis
            </h1>
            <p className="text-slate-500 text-sm">
              AI-Powered Multi-Factor Comparison
            </p>
          </div>
          <div className="flex gap-2.5">
            {activeDecisionId && (
              <button
                id="reset-state-btn"
                onClick={() => setActiveDecisionId(undefined)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-700 transition"
              >
                New Analysis Question
              </button>
            )}
            <div className="px-3 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-mono font-bold rounded-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              High Accuracy Model
            </div>
          </div>
        </header>

        {/* Current Active Tiebreaker notice card with percentage metric matching structural HTML theme */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
          <div className="flex-1 space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Current Dilemma Context
            </label>
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {activeDecision 
                ? activeDecision.title 
                : "Awaiting incoming analysis. Provide a question to start the strategic resolution workflow."}
            </p>
            {activeDecision && activeDecision.optionAName && (
              <p className="text-xs text-slate-400 font-mono">
                Comparing choices: {activeDecision.optionAName} vs. {activeDecision.optionBName || "Alternative Options"}
              </p>
            )}
          </div>
          <div className="hidden sm:block h-12 w-[1.5px] bg-slate-200 shrink-0"></div>
          <div className="text-left sm:text-right shrink-0 flex flex-col justify-center">
            <p className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-widest">
              Analysis Confidence
            </p>
            <p className="text-2xl font-black text-indigo-600 font-display">
              {activeDecision ? "98.4%" : "100%"}
            </p>
          </div>
        </section>

        {/* Core dynamic content views */}
        <div id="workspace-viewport" className="flex-1">
          <AnimatePresence mode="wait">
            {isLoading ? (
              /* Dynamic cycling loading screen */
              <motion.div
                key="loading"
                id="results-loader"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-10 sm:p-14 rounded-2xl border border-indigo-100 shadow-xl flex flex-col items-center justify-center text-center space-y-7"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
                  <Scale className="absolute inset-0 m-auto text-indigo-600 w-6 h-6 animate-pulse" />
                </div>

                <div className="space-y-2.5 max-w-md">
                  <h3 className="font-display font-bold text-slate-800 text-base">Consulting Strategic Arbiter</h3>
                  <div className="h-10 flex items-center justify-center font-mono">
                    <motion.p
                      key={loadingPhaseIndex}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs font-bold text-indigo-600"
                    >
                      {LOADING_PHASES[loadingPhaseIndex]}
                    </motion.p>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Analyzing weights, generating SWOT matrices, and formatting strategic consensus. This takes about 4 to 8 seconds.
                  </p>
                </div>
              </motion.div>
            ) : error ? (
              /* Error Alert wrapper */
              <motion.div
                key="error"
                id="results-error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200/80 p-6 rounded-2xl space-y-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-semibold text-red-800 text-sm">Strategic Generation Blocked</h3>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">{error}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-red-100">
                  <button
                    id="retry-api-call-btn"
                    onClick={() => setError(null)}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-750 text-white font-medium rounded-lg text-xs cursor-pointer transition-colors"
                  >
                    Dismiss & Try Again
                  </button>
                </div>
              </motion.div>
            ) : activeDecision?.result ? (
              /* Analysis dashboard loaded views */
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <AnalysisResults
                  title={activeDecision.title}
                  result={activeDecision.result}
                  isBookmarked={!!activeDecision.isBookmarked}
                  onToggleBookmark={() => handleToggleBookmark(activeDecision.id)}
                  onReset={() => setActiveDecisionId(undefined)}
                />
              </motion.div>
            ) : (
              /* Create workflow form */
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <CreateDecision onSubmit={handleCalculateTiebreaker} isLoading={isLoading} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sleek footer section inside the workspace region */}
        <footer className="mt-auto pt-6 border-t border-slate-200 text-xs text-slate-405 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
          <p>© {new Date().getFullYear()} The Tiebreaker. Strategic AI consensus generated analytical outcomes.</p>
          <p className="font-mono text-[10px]">Client-side Persistent Workspace logs</p>
        </footer>
      </main>
    </div>
  );
}
