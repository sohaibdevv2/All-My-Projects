import React, { useState } from "react";
import { Search, Trash2, Calendar, Bookmark, BookmarkCheck, ArrowRight, ClipboardList } from "lucide-react";
import { Decision } from "../types";

interface DecisionHistoryProps {
  decisions: Decision[];
  activeDecisionId?: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleBookmark: (id: string) => void;
}

export default function DecisionHistory({
  decisions,
  activeDecisionId,
  onSelect,
  onDelete,
  onToggleBookmark,
}: DecisionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDecisions = decisions.filter((d) =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div id="decision-history-sidebar" className="flex flex-col space-y-4 h-full">
      <div id="history-header" className="flex items-center justify-between">
        <div>
          <h3 id="history-title" className="font-display font-bold text-slate-200 text-sm tracking-tight uppercase">
            Recent Decisions
          </h3>
          <p id="history-subtitle" className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
            Past Dilemmas & Bookmarks
          </p>
        </div>
        <div id="history-badge-count" className="px-2 py-0.5 bg-slate-800 text-slate-350 border border-slate-700/60 rounded text-[10px] font-mono font-bold">
          {decisions.length}
        </div>
      </div>

      {/* Search bar */}
      <div id="search-input-wrapper" className="relative">
        <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-500" />
        <input
          id="history-search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search prior topics..."
          className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-slate-800/65 focus:bg-slate-850/90 border border-slate-700/60 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
        />
      </div>

      {/* Decision list container */}
      <div id="history-items-list" className="flex-1 overflow-y-auto space-y-2 pr-0.5 max-h-[350px] lg:max-h-[500px]">
        {filteredDecisions.length === 0 ? (
          <div id="history-empty-state" className="text-center py-6 px-3 border border-dashed border-slate-800 rounded-xl space-y-2">
            <ClipboardList className="w-6 h-6 text-slate-700 mx-auto" />
            <p className="text-xs text-slate-500">
              {searchTerm ? "No search results" : "Empty log workspace"}
            </p>
          </div>
        ) : (
          filteredDecisions.map((decision) => {
            const isActive = decision.id === activeDecisionId;
            return (
              <div
                key={decision.id}
                id={`history-item-${decision.id}`}
                className={`p-3 rounded-lg border transition-all flex flex-col gap-2 relative group ${
                  isActive
                    ? "bg-slate-800/90 border-slate-700 text-slate-100 shadow-sm"
                    : "border-transparent bg-slate-900/30 hover:bg-slate-850/40 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <button
                    id={`select-btn-${decision.id}`}
                    onClick={() => onSelect(decision.id)}
                    className="flex-1 text-left cursor-pointer focus:outline-none"
                  >
                    <h4 className={`text-xs font-medium leading-snug line-clamp-2 transition-colors ${
                      isActive ? "text-slate-100" : "text-slate-400 group-hover:text-slate-200"
                    }`}>
                      {decision.title}
                    </h4>
                    {decision.optionAName && (
                      <p className="text-[10px] text-slate-500 font-mono mt-1">
                        {decision.optionAName} vs {decision.optionBName || "Alternative"}
                      </p>
                    )}
                  </button>

                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      id={`bookmark-btn-${decision.id}`}
                      onClick={() => onToggleBookmark(decision.id)}
                      className={`p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer ${
                        decision.isBookmarked ? "text-amber-400" : "text-slate-500 hover:text-slate-400"
                      }`}
                      title={decision.isBookmarked ? "Unbookmark" : "Bookmark decision"}
                    >
                      {decision.isBookmarked ? (
                        <BookmarkCheck className="w-3 h-3 text-amber-500" />
                      ) : (
                        <Bookmark className="w-3 h-3" />
                      )}
                    </button>

                    <button
                      id={`delete-btn-${decision.id}`}
                      onClick={() => onDelete(decision.id)}
                      className="p-1 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[9px] text-slate-500 bg-slate-950/20 px-2 py-0.5 rounded border border-transparent group-hover:border-slate-800/40 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5 text-slate-600" />
                    {formatDate(decision.createdAt)}
                  </span>
                  {decision.result ? (
                    <span className="text-indigo-400 font-bold flex items-center gap-0.5">
                      Analyzed
                      <ArrowRight className="w-2 h-2" />
                    </span>
                  ) : (
                    <span className="text-amber-500">Pending</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
