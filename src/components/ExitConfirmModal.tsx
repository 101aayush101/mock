import React from 'react';
import { LogOut, CheckCircle2, RotateCcw, X, AlertTriangle, FileText } from 'lucide-react';
import { Question, UserResponse } from '../types';

interface ExitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExitWithoutSave: () => void;
  onSubmitAndExit: () => void;
  totalQuestions: number;
  responses: Record<number, UserResponse>;
  timeRemaining: number;
}

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmExitWithoutSave,
  onSubmitAndExit,
  totalQuestions,
  responses,
  timeRemaining,
}) => {
  if (!isOpen) return null;

  const answeredCount = Object.values(responses).filter(
    (r) => r.status === 'answered' || r.status === 'answered_and_marked'
  ).length;

  const markedCount = Object.values(responses).filter(
    (r) => r.status === 'marked_for_review' || r.status === 'answered_and_marked'
  ).length;

  const formatTime = (secs: number) => {
    const mins = Math.floor(Math.max(0, secs) / 60);
    const s = Math.max(0, secs) % 60;
    return `${mins}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-300 dark:border-slate-800 max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-rose-600 dark:bg-rose-700 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/20">
              <LogOut className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Exit Mock Examination</h3>
              <p className="text-[11px] text-rose-100">Leave the active test session</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Session Snapshot</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                {formatTime(timeRemaining)} remaining
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <div className="text-base font-bold text-slate-900 dark:text-white font-mono">
                  {totalQuestions}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Total Questions</div>
              </div>

              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <div className="text-base font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                  {answeredCount}
                </div>
                <div className="text-[10px] text-emerald-800 dark:text-emerald-300">Answered</div>
              </div>

              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                <div className="text-base font-bold text-purple-700 dark:text-purple-400 font-mono">
                  {markedCount}
                </div>
                <div className="text-[10px] text-purple-800 dark:text-purple-300">For Review</div>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <p>
              Are you sure you want to exit the test? Please choose how you would like to proceed:
            </p>
            <ul className="space-y-1.5 pl-2 text-[11px] text-slate-500 dark:text-slate-400">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Submit &amp; View Analysis:</strong> Saves your current responses, calculates marks (+2 / −0.5), and opens the detailed solution window.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">•</span>
                <span><strong>Discard &amp; Exit:</strong> Leaves the exam immediately and returns to the home screen without recording this test.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="bg-slate-50 dark:bg-slate-950 px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-xl transition cursor-pointer"
          >
            Resume Test
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onConfirmExitWithoutSave}
              className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800 rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard &amp; Exit</span>
            </button>

            <button
              onClick={onSubmitAndExit}
              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Submit &amp; View Score</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
