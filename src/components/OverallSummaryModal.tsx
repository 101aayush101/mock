import React from 'react';
import { X, CheckCircle2, Clock, BarChart2 } from 'lucide-react';
import { Question, UserResponse, SectionId } from '../types';
import { EXAM_SECTIONS } from '../data/mockExamData';

interface OverallSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  responses: Record<number, UserResponse>;
  timeRemainingSeconds: number;
}

export const OverallSummaryModal: React.FC<OverallSummaryModalProps> = ({
  isOpen,
  onClose,
  questions,
  responses,
  timeRemainingSeconds,
}) => {
  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}m ${remainder.toString().padStart(2, '0')}s`;
  };

  const sectionsData = EXAM_SECTIONS.map((sec, idx) => {
    const partCode = `PART-${String.fromCharCode(65 + idx)}`;
    let answered = 0;
    let notAnswered = 0;
    let marked = 0;
    let notVisited = 0;

    for (let i = sec.startNumber; i <= sec.endNumber; i++) {
      const resp = responses[i];
      const status = resp?.status || 'not_visited';
      if (status === 'answered' || status === 'answered_and_marked') {
        answered++;
      } else if (status === 'not_answered') {
        notAnswered++;
      } else if (status === 'marked_for_review') {
        marked++;
      } else {
        notVisited++;
      }
    }

    return {
      partCode,
      name: sec.name,
      total: 25,
      answered,
      notAnswered,
      marked,
      notVisited,
    };
  });

  const grandTotals = sectionsData.reduce(
    (acc, curr) => ({
      total: acc.total + curr.total,
      answered: acc.answered + curr.answered,
      notAnswered: acc.notAnswered + curr.notAnswered,
      marked: acc.marked + curr.marked,
      notVisited: acc.notVisited + curr.notVisited,
    }),
    { total: 0, answered: 0, notAnswered: 0, marked: 0, notVisited: 0 }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 select-none">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="bg-[#173e6d] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm tracking-wide">Overall Test Summary (Tier-I)</span>
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
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Exam Name:</span>
              <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                CGL Tier 1 — 2026 Trend Simulation
              </div>
            </div>
            <div className="text-right">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Time Left:</span>
              <div className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">
                {formatTime(timeRemainingSeconds)}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="py-2.5 px-3">Section</th>
                  <th className="py-2.5 px-3 text-center">Total</th>
                  <th className="py-2.5 px-3 text-center text-emerald-600 dark:text-emerald-400">
                    Answered
                  </th>
                  <th className="py-2.5 px-3 text-center text-rose-600 dark:text-rose-400">
                    Not Answered
                  </th>
                  <th className="py-2.5 px-3 text-center text-purple-600 dark:text-purple-400">
                    Marked
                  </th>
                  <th className="py-2.5 px-3 text-center text-slate-500">Not Visited</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {sectionsData.map((sec) => (
                  <tr key={sec.partCode} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold">
                      <span className="inline-block px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-bold rounded text-[10px] mr-2">
                        {sec.partCode}
                      </span>
                      {sec.name}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-semibold">{sec.total}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {sec.answered}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-600 dark:text-rose-400">
                      {sec.notAnswered}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-semibold text-purple-600 dark:text-purple-400">
                      {sec.marked}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                      {sec.notVisited}
                    </td>
                  </tr>
                ))}
                {/* Grand Total Row */}
                <tr className="bg-slate-100/90 dark:bg-slate-800/90 font-bold border-t-2 border-slate-300 dark:border-slate-700">
                  <td className="py-2.5 px-3">Grand Total</td>
                  <td className="py-2.5 px-3 text-center font-mono">{grandTotals.total}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-emerald-600 dark:text-emerald-400">
                    {grandTotals.answered}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-rose-600 dark:text-rose-400">
                    {grandTotals.notAnswered}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-purple-600 dark:text-purple-400">
                    {grandTotals.marked}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                    {grandTotals.notVisited}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition"
          >
            Back to Test
          </button>
        </div>
      </div>
    </div>
  );
};
