import React from 'react';
import { Question, UserResponse } from '../types';
import { EXAM_SECTIONS } from '../data/mockExamData';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface SubmitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  questions: Question[];
  responses: Record<number, UserResponse>;
  timeRemaining: number;
}

export const SubmitConfirmModal: React.FC<SubmitConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmSubmit,
  questions,
  responses,
  timeRemaining,
}) => {
  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(Math.max(0, secs) / 60);
    const s = Math.max(0, secs) % 60;
    return `${mins}m ${s}s`;
  };

  const sectionStats = EXAM_SECTIONS.map((section) => {
    const secQuestions = questions.filter((q) => q.sectionId === section.id);
    let answered = 0;
    let notAnswered = 0;
    let marked = 0;
    let answeredAndMarked = 0;
    let notVisited = 0;

    secQuestions.forEach((q) => {
      const status = responses[q.id]?.status || 'not_visited';
      if (status === 'answered') answered++;
      else if (status === 'not_answered') notAnswered++;
      else if (status === 'marked_for_review') marked++;
      else if (status === 'answered_and_marked') answeredAndMarked++;
      else notVisited++;
    });

    return {
      section,
      total: secQuestions.length,
      answered,
      notAnswered,
      marked,
      answeredAndMarked,
      notVisited,
      effectiveAttempted: answered + answeredAndMarked,
    };
  });

  const grandTotal = sectionStats.reduce(
    (acc, curr) => ({
      total: acc.total + curr.total,
      answered: acc.answered + curr.answered,
      notAnswered: acc.notAnswered + curr.notAnswered,
      marked: acc.marked + curr.marked,
      answeredAndMarked: acc.answeredAndMarked + curr.answeredAndMarked,
      notVisited: acc.notVisited + curr.notVisited,
      effectiveAttempted: acc.effectiveAttempted + curr.effectiveAttempted,
    }),
    {
      total: 0,
      answered: 0,
      notAnswered: 0,
      marked: 0,
      answeredAndMarked: 0,
      notVisited: 0,
      effectiveAttempted: 0,
    }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="font-semibold text-base">Submit Examination Confirmation</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {grandTotal.effectiveAttempted < grandTotal.total ? (
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-xs text-amber-950 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-900">
                  Midway Submission Warning: You have answered {grandTotal.effectiveAttempted} of {grandTotal.total} questions
                </div>
                <div className="mt-0.5 text-amber-800 leading-relaxed">
                  There are still <strong className="text-amber-950 font-bold">{grandTotal.total - grandTotal.effectiveAttempted} questions remaining</strong> and{' '}
                  <strong className="text-amber-950 font-bold">{formatTime(timeRemaining)} left</strong> on the clock.
                  If you want to continue attempting other sections (Reasoning, General Awareness, Quant, English), click{' '}
                  <strong>&quot;Resume Test&quot;</strong>.
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-900 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">All Questions Visited:</span> You still have{' '}
                <strong className="font-bold text-emerald-950">{formatTime(timeRemaining)}</strong>{' '}
                remaining. Once submitted, your answers will be locked and evaluated.
              </div>
            </div>
          )}

          {/* Summary Table */}
          <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Section Name</th>
                  <th className="p-2.5 text-center">Total Qs</th>
                  <th className="p-2.5 text-center bg-emerald-50 text-emerald-800">Answered</th>
                  <th className="p-2.5 text-center bg-purple-50 text-purple-800">Marked Review</th>
                  <th className="p-2.5 text-center bg-rose-50 text-rose-800">Not Answered</th>
                  <th className="p-2.5 text-center">Not Visited</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {sectionStats.map((stat) => (
                  <tr key={stat.section.id} className="hover:bg-slate-50/70">
                    <td className="p-2.5 font-medium text-slate-800">{stat.section.name}</td>
                    <td className="p-2.5 text-center font-mono">{stat.total}</td>
                    <td className="p-2.5 text-center font-mono font-bold text-emerald-700 bg-emerald-50/40">
                      {stat.answered + stat.answeredAndMarked}
                    </td>
                    <td className="p-2.5 text-center font-mono text-purple-700 bg-purple-50/40">
                      {stat.marked + stat.answeredAndMarked}
                    </td>
                    <td className="p-2.5 text-center font-mono text-rose-700 bg-rose-50/40">
                      {stat.notAnswered}
                    </td>
                    <td className="p-2.5 text-center font-mono text-slate-500">
                      {stat.notVisited}
                    </td>
                  </tr>
                ))}
                {/* Grand Total Row */}
                <tr className="bg-slate-100/80 font-bold text-slate-900 border-t-2 border-slate-300">
                  <td className="p-2.5">Total (All Sections)</td>
                  <td className="p-2.5 text-center font-mono">{grandTotal.total}</td>
                  <td className="p-2.5 text-center font-mono text-emerald-800 bg-emerald-100/50">
                    {grandTotal.effectiveAttempted}
                  </td>
                  <td className="p-2.5 text-center font-mono text-purple-800 bg-purple-100/50">
                    {grandTotal.marked + grandTotal.answeredAndMarked}
                  </td>
                  <td className="p-2.5 text-center font-mono text-rose-800 bg-rose-100/50">
                    {grandTotal.notAnswered}
                  </td>
                  <td className="p-2.5 text-center font-mono text-slate-600">
                    {grandTotal.notVisited}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded border border-slate-300 transition"
          >
            Resume Test
          </button>

          <button
            onClick={onConfirmSubmit}
            className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded shadow transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm &amp; Finish Test</span>
          </button>
        </div>
      </div>
    </div>
  );
};
