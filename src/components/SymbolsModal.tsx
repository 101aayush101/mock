import React from 'react';
import { X, CheckCircle2, Bookmark, EyeOff, AlertCircle } from 'lucide-react';

interface SymbolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SymbolsModal: React.FC<SymbolsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 select-none">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="bg-blue-700 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wide">SSC CGL CBT — Symbols & Legends</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            The question palette on the right side of screen shows the status of each question using the following official symbols:
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="w-7 h-7 rounded-md bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                01
              </span>
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Answered (Green)</span>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  You have answered the question. It will be evaluated for final scoring.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="w-7 h-7 rounded-md bg-rose-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                02
              </span>
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Not Answered (Red)</span>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  You have visited the question but have not answered it yet.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="w-7 h-7 rounded-md bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                03
              </span>
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Marked for Review (Purple)</span>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  You have not answered the question, but have marked it for review. It will NOT be evaluated unless answered.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="w-7 h-7 rounded-md bg-purple-600 text-white font-bold text-xs flex items-center justify-center relative shrink-0 shadow-xs">
                04
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
              </span>
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Answered & Marked for Review (Purple with Green Dot)</span>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  The question is answered AND marked for review. According to SSC CGL rules, <strong className="text-emerald-600 dark:text-emerald-400">it WILL be considered in evaluation</strong>!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="w-7 h-7 rounded-md bg-[#0a25e6] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                05
              </span>
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Not Visited (Blue / Neutral)</span>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  You have not reached or viewed this question yet in the current test.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
