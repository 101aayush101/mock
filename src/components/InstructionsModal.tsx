import React from 'react';
import { X, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h2 className="font-semibold text-base">Examination Instructions &amp; Pattern</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-900">
            <strong className="font-bold">SSC CGL 2026 Tier-I Examination Structure:</strong>
            <p className="mt-1">
              The test consists of 100 Objective Multiple Choice Questions divided into 4 sections of 25 questions each.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">1. Scheme of Examination &amp; Marking:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Each correct response awards <strong>+2.00 marks</strong>.</li>
              <li>Each incorrect response penalizes <strong>−0.50 marks</strong> (Negative Marking).</li>
              <li>Unattempted or skipped questions receive <strong>0 marks</strong>.</li>
              <li>Maximum Marks: <strong>200 Marks</strong>. Total Duration: <strong>60 Minutes</strong>.</li>
              <li>Sectional benchmark target: <strong>15 minutes per section</strong>.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">2. Color Code &amp; Palette Navigation:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200">
                <span className="w-4 h-4 rounded bg-slate-200 border border-slate-300 shrink-0" />
                <span><strong>Gray:</strong> You have not visited the question yet.</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200">
                <span className="w-4 h-4 rounded bg-rose-500 text-white shrink-0" />
                <span><strong>Orange/Red:</strong> You have not answered the question.</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200">
                <span className="w-4 h-4 rounded bg-emerald-600 text-white shrink-0" />
                <span><strong>Green:</strong> You have answered the question.</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200">
                <span className="w-4 h-4 rounded bg-purple-600 text-white shrink-0" />
                <span><strong>Purple:</strong> Marked for review (Not answered).</span>
              </div>
              <div className="col-span-1 sm:col-span-2 flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200">
                <span className="w-4 h-4 rounded bg-purple-600 text-white relative shrink-0">
                  <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </span>
                <span>
                  <strong>Purple + Green Dot:</strong> The question is answered and marked for review. <em>This will be evaluated in the final score.</em>
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">3. Sectional Targets &amp; Strategy:</h3>
            <p>
              Based on recent 2025 candidate trends, aim for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Reasoning:</strong> 21–24 Qs target (Statement-type &amp; matrix sequences)</li>
              <li><strong>General Awareness:</strong> 13–18 Qs target (Statement-based facts &amp; recent science)</li>
              <li><strong>Quantitative Aptitude:</strong> 19–23 Qs target (Calculation efficiency)</li>
              <li><strong>English Comprehension:</strong> 20–23 Qs target (Vocabulary &amp; cloze test flow)</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow transition"
          >
            Close Instructions
          </button>
        </div>
      </div>
    </div>
  );
};
