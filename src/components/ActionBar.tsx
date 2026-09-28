import React from 'react';
import { ChevronLeft, ChevronRight, Check, RotateCcw, Bookmark, Send, PenTool, LogOut } from 'lucide-react';
import { ExamTheme } from '../types';

interface ActionBarProps {
  onSaveAndNext: () => void;
  onClearResponse: () => void;
  onMarkForReviewAndNext: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onOpenScratchpad?: () => void;
  onExitExam?: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  hasSelection: boolean;
  theme?: ExamTheme;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  onSaveAndNext,
  onClearResponse,
  onMarkForReviewAndNext,
  onPrevious,
  onNext,
  onSubmit,
  onOpenScratchpad,
  onExitExam,
  hasPrevious,
  hasNext,
  hasSelection,
  theme = 'testbook',
}) => {
  const barBgClass =
    theme === 'tcs'
      ? 'bg-[#173e6d] border-t-2 border-amber-400 text-white'
      : theme === 'dark'
      ? 'bg-slate-950 border-t border-slate-800 text-white'
      : 'bg-slate-900 border-t border-slate-800 text-white';

  return (
    <div className={`${barBgClass} py-2.5 px-3 select-none shadow-lg transition-colors`}>
      <div className="w-[90%] mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left Side Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onMarkForReviewAndNext}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-purple-700 hover:bg-purple-600 active:scale-95 text-white transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Mark for Review & Next</span>
          </button>

          <button
            onClick={onClearResponse}
            disabled={!hasSelection}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1.5 border cursor-pointer ${
              hasSelection
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200'
                : 'bg-slate-900/50 border-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Response</span>
          </button>

          {onOpenScratchpad && (
            <button
              onClick={onOpenScratchpad}
              className="sm:hidden px-3 py-2 rounded-lg text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center gap-1"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Rough Sheet</span>
            </button>
          )}

          {onExitExam && (
            <button
              onClick={onExitExam}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 flex items-center gap-1.5 transition cursor-pointer"
              title="Exit Exam"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Exit</span>
            </button>
          )}
        </div>

        {/* Right Side Navigation & Submit */}
        <div className="flex items-center gap-2 flex-wrap ml-auto">
          <button
            onClick={onPrevious}
            disabled={!hasPrevious}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1 border cursor-pointer ${
              hasPrevious
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200'
                : 'bg-slate-900/50 border-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={onSaveAndNext}
            className={`px-5 py-2 rounded-lg text-xs font-bold active:scale-95 text-white transition flex items-center gap-1.5 shadow-md cursor-pointer ${
              theme === 'tcs' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            <span>Save & Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onSubmit}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 active:scale-95 text-white transition flex items-center gap-1.5 shadow-md ml-1 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

