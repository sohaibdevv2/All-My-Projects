import React, { useState } from "react";
import { HelpCircle, Sparkles, ArrowRight, Briefcase, Home, ShieldAlert, Car, Scale } from "lucide-react";

interface CreateDecisionProps {
  onSubmit: (title: string, optionA: string, optionB: string) => void;
  isLoading: boolean;
}

const TEMPLATES = [
  {
    id: "tpl-career",
    category: "Career move",
    icon: Briefcase,
    title: "Should I accept a risky startup offer with equity or stay at my secure corporate job?",
    optionA: "Accept Startup Offer",
    optionB: "Remain at Corporate Job",
    color: "from-blue-500/5 to-indigo-500/5 hover:border-indigo-500 hover:bg-slate-50/20",
  },
  {
    id: "tpl-relocation",
    category: "Life & Home",
    icon: Home,
    title: "Should we move out of the city to suburbs or stay in our downtown apartment?",
    optionA: "Move to Suburbs",
    optionB: "Stay Downtown",
    color: "from-emerald-500/5 to-teal-500/5 hover:border-emerald-500 hover:bg-slate-50/20",
  },
  {
    id: "tpl-finance",
    category: "Finance",
    icon: Car,
    title: "Should I purchase a brand new Electric Vehicle or stick to my current petrol sedan?",
    optionA: "Purchase New EV",
    optionB: "Keep Current Sedan",
    color: "from-amber-500/5 to-orange-500/5 hover:border-amber-500 hover:bg-slate-50/20",
  },
];

export default function CreateDecision({ onSubmit, isLoading }: CreateDecisionProps) {
  const [title, setTitle] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim(), optionA.trim(), optionB.trim());
  };

  const handleApplyTemplate = (tpl: typeof TEMPLATES[0]) => {
    setTitle(tpl.title);
    setOptionA(tpl.optionA);
    setOptionB(tpl.optionB);
  };

  return (
    <div id="create-decision-container" className="space-y-10 animate-fade-in duration-300">
      {/* Hero Header with exact Sleek design colors */}
      <div id="hero-banner" className="space-y-3.5 max-w-3xl">
        <div id="hero-badge" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          The Multi-Factor Arbiter Panel
        </div>
        <h1 id="hero-title" className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-none">
          Dismantle Dilemmas. <br className="hidden sm:block" />
          Make the <span className="text-indigo-650 bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text">Optimal Decision.</span>
        </h1>
        <p id="hero-subtitle" className="text-slate-550 text-sm sm:text-base leading-relaxed max-w-2xl">
          Stuck between two options? Enter your decision question. Our AI model will perform a professional, side-by-side assessment of SWOT and weighted pros/cons to reveal your optimal path.
        </p>
      </div>

      {/* Grid container */}
      <div id="decision-form-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Entry */}
        <div id="form-card" className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div id="form-header" className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shadow-inner">
              <Scale className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-base">Decision Workspace</h2>
              <p className="text-xs text-slate-400">Provide the central dilemma and optional path labels</p>
            </div>
          </div>

          <form id="decision-eval-form" onSubmit={handleSubmit} className="space-y-6">
            <div id="form-group-title" className="space-y-2.5">
              <label htmlFor="decision-title-input" className="block text-xs font-bold uppercase tracking-wide text-slate-500 font-mono">
                What is the active dilemma or decision question? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="decision-title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Should we adopt a hybrid office model or move 100% remote-first strategy?"
                className="w-full min-h-[110px] p-4 text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm leading-relaxed transition-all resize-none shadow-inner"
                required
                disabled={isLoading}
              />
              <p className="text-[11px] text-slate-400 font-sans">
                Describe the context clearly, mentioning key constraints, budget limits, or targets if possible.
              </p>
            </div>

            <div id="options-pair" className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div id="form-group-optionA" className="space-y-2">
                <label htmlFor="optionA-input" className="block text-xs font-bold uppercase tracking-wide text-slate-500 font-mono">
                  Option A Name <span className="text-slate-400 font-normal capitalize">(e.g., Hybrid Model)</span>
                </label>
                <input
                  id="optionA-input"
                  type="text"
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  placeholder="e.g., Hybrid Model"
                  className="w-full px-4 py-2.5 text-sm text-slate-850 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                  disabled={isLoading}
                />
              </div>

              <div id="form-group-optionB" className="space-y-2">
                <label htmlFor="optionB-input" className="block text-xs font-bold uppercase tracking-wide text-slate-500 font-mono">
                  Option B Name <span className="text-slate-400 font-normal capitalize">(e.g., Remote-First)</span>
                </label>
                <input
                  id="optionB-input"
                  type="text"
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  placeholder="e.g., Remote-First"
                  className="w-full px-4 py-2.5 text-sm text-slate-850 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div id="hints-notice" className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 flex gap-2.5">
              <span className="text-indigo-600 font-mono text-xs font-bold select-none pt-0.5">ℹ</span>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                <strong>Dynamic Inference:</strong> If options are left empty, our AI system automatically extracts the two most logical, opposed strategic choices from your question!
              </p>
            </div>

            <button
              id="submit-decision-btn"
              type="submit"
              disabled={isLoading || !title.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold select-none cursor-pointer transition-all duration-200 shadow-md shadow-indigo-100 hover:shadow-none"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing factors & compiling metrics...
                </>
              ) : (
                <>
                  Run Analysis & Tiebreaker
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Templates Sidebar */}
        <div id="templates-column" className="lg:col-span-4 space-y-6">
          <div id="templates-header" className="space-y-1">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">Try a Practice Template</h3>
            <p className="text-xs text-slate-500">Pick an instant classic dilemma to load pre-configured parameters</p>
          </div>

          <div id="templates-list" className="space-y-3">
            {TEMPLATES.map((tpl) => {
              const IconComp = tpl.icon;
              return (
                <button
                  key={tpl.id}
                  id={tpl.id}
                  onClick={() => handleApplyTemplate(tpl)}
                  className={`w-full text-left p-4 rounded-xl border border-slate-200 bg-gradient-to-br ${tpl.color} transition-all duration-250 flex items-start gap-3 cursor-pointer group`}
                  disabled={isLoading}
                >
                  <div className="p-2 bg-white rounded-lg border border-slate-150 shadow-sm group-hover:scale-110 transition-transform text-slate-700">
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                      {tpl.category}
                    </span>
                    <h4 className="font-bold text-slate-800 text-xs leading-snug group-hover:text-indigo-650 transition-colors">
                      {tpl.title}
                    </h4>
                    <p className="text-[10px] text-slate-550 italic font-medium font-sans">
                      {tpl.optionA} vs {tpl.optionB}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick FAQ info card */}
          <div id="framework-faq-card" className="p-4 bg-white rounded-xl border border-slate-200/90 space-y-3 shadow-xs">
            <h4 className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <ShieldAlert className="w-3.5 h-3.5" />
              Strategic Mechanics
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600 leading-normal font-sans">
              <p>
                <strong>Comparative Indexing:</strong> Weighs critical factors like cost, burnouts, limits, and timelines on a normalized scale.
              </p>
              <p>
                <strong>SWOT Quadrants:</strong> Partitions characteristics into internal factors vs external threats to help executives audit action.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
