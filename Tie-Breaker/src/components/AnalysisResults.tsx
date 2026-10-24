import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  Scale,
  Award,
  AlertTriangle,
  Flame,
  Lightbulb,
  Copy,
  Check,
  RotateCcw,
  PlusCircle,
  HelpCircle,
  Zap,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { AnalysisResult, ComparisonCriteria, OptionAnalysis } from "../types";

interface AnalysisResultsProps {
  title: string;
  result: AnalysisResult;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onReset: () => void;
}

export default function AnalysisResults({
  title,
  result,
  isBookmarked,
  onToggleBookmark,
  onReset,
}: AnalysisResultsProps) {
  const [copied, setCopied] = useState(false);
  const [swotActiveOption, setSwotActiveOption] = useState<"A" | "B">("A");

  // Dynamic weights for each criteria (playground multiplier)
  const initialWeights = useMemo(() => {
    const defaultDict: Record<string, number> = {};
    result.comparisonTable.forEach((item) => {
      defaultDict[item.criteria] = 1.0;
    });
    return defaultDict;
  }, [result.comparisonTable]);

  const [weights, setWeights] = useState<Record<string, number>>(initialWeights);

  // Dynamic score computation based on playground multipliers
  const { weightedA, weightedB, tiltWinner, tiltDifference } = useMemo(() => {
    let sumA = 0;
    let sumB = 0;
    let maxPossible = 0;

    result.comparisonTable.forEach((item) => {
      const w = weights[item.criteria] ?? 1.0;
      sumA += item.optionAScore * w;
      sumB += item.optionBScore * w;
      maxPossible += 5 * w;
    });

    const percentA = maxPossible > 0 ? Math.round((sumA / maxPossible) * 100) : 0;
    const percentB = maxPossible > 0 ? Math.round((sumB / maxPossible) * 100) : 0;

    let winner = "";
    let diff = 0;
    if (percentA > percentB) {
      winner = "A";
      diff = percentA - percentB;
    } else if (percentB > percentA) {
      winner = "B";
      diff = percentB - percentA;
    } else {
      winner = "TIE";
    }

    return {
      weightedA: percentA,
      weightedB: percentB,
      tiltWinner: winner,
      tiltDifference: diff,
    };
  }, [result.comparisonTable, weights]);

  const handleWeightChange = (criteria: string, newWeight: number) => {
    setWeights((prev) => ({
      ...prev,
      [criteria]: newWeight,
    }));
  };

  const handleResetWeights = () => {
    setWeights(initialWeights);
  };

  const handleCopySummary = () => {
    const weightSummary = result.comparisonTable
      .map((c) => {
        const wVal = weights[c.criteria] === 2 ? "High (2x)" : weights[c.criteria] === 0.5 ? "Low (0.5x)" : weights[c.criteria] === 0 ? "Ignored" : "Normal";
        return `  * ${c.criteria}: ${result.optionA.name} (${c.optionAScore}/5) vs ${result.optionB.name} (${c.optionBScore}/5) [Weight: ${wVal}]`;
      })
      .join("\n");

    const textToCopy = `--- THE TIEBREAKER ASSESSMENT ---
Decision: ${title}

1. Option A: ${result.optionA.name} (Priority Match: ${weightedA}%)
   - Summary: ${result.optionA.summary}
2. Option B: ${result.optionB.name} (Priority Match: ${weightedB}%)
   - Summary: ${result.optionB.summary}

Dynamic Playground Verdict: 
${
  tiltWinner === "A"
    ? `🏆 Recommended Option: "${result.optionA.name}" (+${tiltDifference}% Margin)`
    : tiltWinner === "B"
    ? `🏆 Recommended Option: "${result.optionB.name}" (+${tiltDifference}% Margin)`
    : "⚖️ Parity Balance"
}

AI Strategic Consensus:
"${result.verdict}"

Reasoning Breakdown:
${result.recommendationReasoning}

Summary of Matrix Comparisons:
${weightSummary}
    `;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentSwotOption: OptionAnalysis = swotActiveOption === "A" ? result.optionA : result.optionB;

  return (
    <div id="results-workspace" className="space-y-8 animate-fade-in duration-300">
      {/* Top Banner section */}
      <div id="results-action-strip" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div id="results-headline-text" className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            Active Workspace Result
          </label>
          <h2 className="font-display font-extrabold text-slate-900 text-lg sm:text-xl md:text-2xl leading-tight">
            {title}
          </h2>
        </div>

        <div id="results-action-buttons" className="flex items-center gap-2.5 shrink-0">
          <button
            id="bookmark-toggle-analysis-btn"
            onClick={onToggleBookmark}
            className={`px-4 py-2 rounded-lg border text-xs font-semibold select-none cursor-pointer transition-all flex items-center gap-1.5 ${
              isBookmarked
                ? "bg-amber-500/10 text-amber-700 border-amber-350"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {isBookmarked ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-amber-500" />
                Bookmarked
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 text-slate-400" />
                Bookmark Result
              </>
            )}
          </button>

          <button
            id="share-copy-analysis-btn"
            onClick={handleCopySummary}
            className="px-4 py-2 bg-slate-900 border border-slate-900 hover:bg-indigo-600 hover:border-indigo-600 text-white rounded-lg text-xs font-semibold select-none cursor-pointer transition-all shadow-sm flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300 animate-bounce" />
                Copied Summary
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Export Assessment
              </>
            )}
          </button>

          <button
            id="new-decision-reset-btn"
            onClick={onReset}
            className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-350 text-slate-600 rounded-lg text-xs font-semibold select-none cursor-pointer transition-all flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New
          </button>
        </div>
      </div>

      {/* Dynamic Recommendation Playground Widget - High Contrast Verdict Banner */}
      <div id="interactive-verdict-banner" className="bg-gradient-to-r from-indigo-650 to-violet-750 text-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-indigo-100 flex flex-col md:flex-row items-stretch gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -z-0 pointer-events-none" />

        {/* Floating icon */}
        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center shrink-0 self-start md:self-center text-3xl font-bold shadow-inner relative z-10 select-none">
          ✨
        </div>

        {/* Verdict and dynamic details nested */}
        <div className="flex-1 flex flex-col justify-between space-y-4 relative z-10">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-200 bg-white/10 px-2.5 py-1 rounded-full inline-block mb-3.5 font-mono">
              The Tiebreaker Verdict
            </span>
            <h3 className="font-display font-extrabold text-xl sm:text-2xl leading-snug">
              {tiltWinner === "A" ? (
                <>
                  Dynamic model suggests <span className="underline underline-offset-4 decoration-white font-black">{result.optionA.name}</span> is the dominant path.
                </>
              ) : tiltWinner === "B" ? (
                <>
                  Dynamic model suggests <span className="underline underline-offset-4 decoration-white font-black">{result.optionB.name}</span> is the dominant path.
                </>
              ) : (
                <>
                  Both pathways are in perfect mathematical balance.
                </>
              )}
            </h3>
            <p className="text-indigo-100 text-sm mt-3 leading-relaxed max-w-3xl font-sans italic opacity-95">
              "{result.verdict}"
            </p>
          </div>

          <div className="border-t border-white/20 pt-4 text-xs text-indigo-100 leading-normal font-sans">
            <h4 className="font-bold text-white mb-1.5 uppercase tracking-wide text-[10px] font-mono">Strategic Counsel & Rationale:</h4>
            <p className="line-clamp-4 hover:line-clamp-none transition-all duration-300 bg-white/5 p-3 rounded-lg border border-white/10">
              {result.recommendationReasoning}
            </p>
          </div>
        </div>

        {/* Dynamic score dials */}
        <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-white/15 pt-5 md:pt-0 md:pl-6 flex flex-col justify-between space-y-3 shrink-0 relative z-10 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider font-mono">
              Computed Balance Tilt
            </span>
            <div className="text-2xl font-black text-white">
              {tiltWinner === "A" ? (
                <span>Option A +{tiltDifference}%</span>
              ) : tiltWinner === "B" ? (
                <span>Option B +{tiltDifference}%</span>
              ) : (
                <span>0% Split Play</span>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-indigo-100">
                <span className="truncate max-w-[130px] font-sans font-semibold text-white">{result.optionA.name}</span>
                <span>{weightedA}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-300 transition-all duration-300" style={{ width: `${weightedA}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-indigo-100">
                <span className="truncate max-w-[130px] font-sans font-semibold text-white">{result.optionB.name}</span>
                <span>{weightedB}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 transition-all duration-300" style={{ width: `${weightedB}%` }} />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-[9px] text-indigo-200 leading-relaxed font-sans">
              * Configure criteria importance coefficients below to calculate real-time sensitivities.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: Interactively Weighted Comparison Table (Match target "Feature Comparison Table") */}
      <div id="matrix-table-card" className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
        <div id="table-card-header" className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-display font-bold text-slate-700 text-sm sm:text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-500" />
              Feature Comparison Table
            </h3>
            <p className="text-[11px] text-slate-400 hidden sm:block">Verify criteria and adjust weight factors to compute final parity outcomes</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="reset-matrix-weights-btn"
              onClick={handleResetWeights}
              className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 hover:border-slate-300 text-slate-600 rounded bg-white cursor-pointer transition-colors"
            >
              Parity Parity (1.0x)
            </button>
            <span className="text-[9px] bg-slate-200 px-2.5 py-1 rounded text-slate-600 font-bold uppercase tracking-wider font-mono">
              Live Weighted Map
            </span>
          </div>
        </div>

        <div id="comparison-table-wrapper" className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-150 bg-white sticky top-0 font-display">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Priority Driver / Metric</th>
                <th className="px-5 py-3.5 font-semibold text-center w-28 text-slate-600">{result.optionA.name}</th>
                <th className="px-5 py-3.5 font-semibold text-center w-28 text-indigo-600">{result.optionB.name}</th>
                <th className="px-5 py-3.5 font-semibold text-center w-40">User Importance</th>
                <th className="px-6 py-3.5 font-semibold min-w-[280px]">Strategic Comparison / Insights</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm divide-y divide-slate-150 font-sans">
              {result.comparisonTable.map((item, idx) => {
                const currentWeight = weights[item.criteria] ?? 1.0;
                return (
                  <tr key={idx} id={`criteria-row-${idx}`} className="hover:bg-slate-50/30 transition-colors">
                    {/* Criteria Name */}
                    <td className="px-6 py-4 font-semibold text-slate-900 balance-content">
                      {item.criteria}
                    </td>

                    {/* Option A Score */}
                    <td className="px-5 py-4 text-center">
                      <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs select-none">
                        {item.optionAScore}/5
                      </span>
                    </td>

                    {/* Option B Score */}
                    <td className="px-5 py-4 text-center">
                      <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs select-none">
                        {item.optionBScore}/5
                      </span>
                    </td>

                    {/* Interactive Importance selector */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {[
                          { val: 0.0, label: "Ø", desc: "Ignore factor" },
                          { val: 0.5, label: "0.5x", desc: "Low importance" },
                          { val: 1.0, label: "1x", desc: "Normal weight" },
                          { val: 2.0, label: "2x", desc: "Critical priority" },
                        ].map((choice) => {
                          const isSelected = currentWeight === choice.val;
                          return (
                            <button
                              key={choice.val}
                              id={`weight-btn-${idx}-${choice.val}`}
                              onClick={() => handleWeightChange(item.criteria, choice.val)}
                              className={`w-7.5 h-6.5 text-[10px] font-bold border rounded flex items-center justify-center cursor-pointer transition-all ${
                                isSelected
                                  ? "bg-slate-900 border-slate-900 text-white shadow"
                                  : "text-slate-500 border-slate-200 bg-slate-50 hover:bg-white"
                              }`}
                              title={choice.desc}
                            >
                              {choice.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>

                    {/* Rationale explanations */}
                    <td className="px-6 py-4 text-xs text-slate-600 leading-normal">
                      <div className="space-y-1.5 max-w-xl">
                        <div>
                          <strong className="text-slate-700">{result.optionA.name}:</strong> {item.optionAExplanation}
                        </div>
                        <div className="border-t border-slate-100/60 pt-1.5">
                          <strong className="text-indigo-605">{result.optionB.name}:</strong> {item.optionBExplanation}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Side-by-Side Pros and Cons Comparison */}
      <div id="side-by-side-pros-cons" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option A pros & cons card */}
        <div id="option-a-proscons-card" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-150 flex items-center justify-between">
            <h3 className="font-display font-extrabold text-slate-800 text-sm sm:text-base">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Pathway A Assessment</span>
              {result.optionA.name}
            </h3>
            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
              Base Rating: {result.optionA.overallScore}/100
            </span>
          </div>

          {/* Pros list */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1 font-mono">
              ✔ Pros & Advantages
            </h4>
            <div className="space-y-2">
              {result.optionA.pros.map((pro, idx) => (
                <div key={idx} className="flex gap-2.5 items-start p-3 rounded-xl bg-emerald-50/40 border border-emerald-100/60 transition-all">
                  <span className="text-emerald-700 font-bold text-xs font-mono select-none px-1.5 py-0.5 bg-white rounded border border-emerald-200">
                    +{pro.impact}
                  </span>
                  <div className="space-y-1 flex-1">
                    <p className="text-xs text-emerald-950 font-medium leading-relaxed">{pro.text}</p>
                    <span className="inline-block text-[8.5px] px-1.5 py-0.5 bg-emerald-100/50 text-emerald-800 rounded font-bold uppercase tracking-wider font-mono">
                      {pro.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cons list */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1 font-mono">
              ✖ Cons & Risks
            </h4>
            <div className="space-y-2">
              {result.optionA.cons.map((con, idx) => (
                <div key={idx} className="flex gap-2.5 items-start p-3 rounded-xl bg-rose-50/30 border border-rose-100/60 transition-all">
                  <span className="text-rose-700 font-bold text-xs font-mono select-none px-1.5 py-0.5 bg-white rounded border border-rose-200">
                    -{con.impact}
                  </span>
                  <div className="space-y-1 flex-1">
                    <p className="text-xs text-rose-950 font-medium leading-relaxed">{con.text}</p>
                    <span className="inline-block text-[8.5px] px-1.5 py-0.5 bg-rose-100/55 text-rose-800 rounded font-bold uppercase tracking-wider font-mono">
                      {con.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Option B pros & cons card */}
        <div id="option-b-proscons-card" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-150 flex items-center justify-between">
            <h3 className="font-display font-extrabold text-indigo-950 text-sm sm:text-base">
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block font-mono">Pathway B Assessment</span>
              {result.optionB.name}
            </h3>
            <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded">
              Base Rating: {result.optionB.overallScore}/100
            </span>
          </div>

          {/* Pros list */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1 font-mono">
              ✔ Pros & Advantages
            </h4>
            <div className="space-y-2">
              {result.optionB.pros.map((pro, idx) => (
                <div key={idx} className="flex gap-2.5 items-start p-3 rounded-xl bg-emerald-50/40 border border-emerald-100/60 transition-all">
                  <span className="text-emerald-700 font-bold text-xs font-mono select-none px-1.5 py-0.5 bg-white rounded border border-emerald-200">
                    +{pro.impact}
                  </span>
                  <div className="space-y-1 flex-1">
                    <p className="text-xs text-emerald-950 font-medium leading-relaxed">{pro.text}</p>
                    <span className="inline-block text-[8.5px] px-1.5 py-0.5 bg-emerald-100/50 text-emerald-800 rounded font-bold uppercase tracking-wider font-mono">
                      {pro.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cons list */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1 font-mono">
              ✖ Cons & Risks
            </h4>
            <div className="space-y-2">
              {result.optionB.cons.map((con, idx) => (
                <div key={idx} className="flex gap-2.5 items-start p-3 rounded-xl bg-rose-50/30 border border-rose-100/60 transition-all">
                  <span className="text-rose-700 font-bold text-xs font-mono select-none px-1.5 py-0.5 bg-white rounded border border-rose-200">
                    -{con.impact}
                  </span>
                  <div className="space-y-1 flex-1">
                    <p className="text-xs text-rose-950 font-medium leading-relaxed">{con.text}</p>
                    <span className="inline-block text-[8.5px] px-1.5 py-0.5 bg-rose-100/55 text-rose-800 rounded font-bold uppercase tracking-wider font-mono">
                      {con.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: SWOT Analysis Widget - Gorgeous Bento quadrants from the design HTML */}
      <div id="swot-evaluation-section" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
        <div id="swot-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-150">
          <div>
            <h3 className="font-display font-bold text-slate-700 text-base">SWOT Decision Matrix</h3>
            <p className="text-xs text-slate-500">Deconstruct internal characteristics and external market factors</p>
          </div>

          {/* Segment control to toggle SWOT between Option A and Option B */}
          <div id="swot-toggles" className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 select-none">
            <button
              id="swot-toggle-a-btn"
              onClick={() => setSwotActiveOption("A")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                swotActiveOption === "A"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Option A: {result.optionA.name}
            </button>
            <button
              id="swot-toggle-b-btn"
              onClick={() => setSwotActiveOption("B")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                swotActiveOption === "B"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Option B: {result.optionB.name}
            </button>
          </div>
        </div>

        {/* SWOT Grid Quadrant Layout - Nested beautiful quadrants exact with spec HTML */}
        <div id="swot-grid-quadrant" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* S - Strengths */}
          <div id="swot-quadrant-s" className="bg-emerald-50 rounded-xl p-4.5 border border-emerald-100 flex flex-col gap-2.5">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block font-mono">
              Strengths (Internal & Positive)
            </span>
            <ul className="text-xs text-emerald-950 space-y-2 list-disc list-inside">
              {currentSwotOption.swot.strengths.map((str, idx) => (
                <li key={idx} className="marker:text-emerald-500 leading-relaxed font-sans">{str}</li>
              ))}
            </ul>
          </div>

          {/* W - Weaknesses */}
          <div id="swot-quadrant-w" className="bg-rose-50 rounded-xl p-4.5 border border-rose-100 flex flex-col gap-2.5">
            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-widest block font-mono">
              Weaknesses (Internal & Negative)
            </span>
            <ul className="text-xs text-rose-950 space-y-2 list-disc list-inside">
              {currentSwotOption.swot.weaknesses.map((wk, idx) => (
                <li key={idx} className="marker:text-rose-400 leading-relaxed font-sans">{wk}</li>
              ))}
            </ul>
          </div>

          {/* O - Opportunities */}
          <div id="swot-quadrant-o" className="bg-sky-50 rounded-xl p-4.5 border border-sky-100 flex flex-col gap-2.5">
            <span className="text-[10px] font-bold text-sky-700 uppercase tracking-widest block font-mono">
              Opportunities (External & Positive)
            </span>
            <ul className="text-xs text-sky-950 space-y-2 list-disc list-inside">
              {currentSwotOption.swot.opportunities.map((op, idx) => (
                <li key={idx} className="marker:text-sky-500 leading-relaxed font-sans">{op}</li>
              ))}
            </ul>
          </div>

          {/* T - Threats */}
          <div id="swot-quadrant-t" className="bg-amber-50 rounded-xl p-4.5 border border-amber-100 flex flex-col gap-2.5">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block font-mono">
              Threats (External & Negative)
            </span>
            <ul className="text-xs text-amber-950 space-y-2 list-disc list-inside">
              {currentSwotOption.swot.threats.map((th, idx) => (
                <li key={idx} className="marker:text-amber-550 leading-relaxed font-sans">{th}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
