import React, { useState } from 'react';
import { Question, SectionId } from '../types';
import { EXAM_SECTIONS } from '../data/mockExamData';
import { X, FileText, ArrowRight } from 'lucide-react';

interface QuestionPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  onSelectQuestion: (index: number) => void;
}

export const QuestionPaperModal: React.FC<QuestionPaperModalProps> = ({
  isOpen,
  onClose,
  questions,
  onSelectQuestion,
}) => {
  const [activeSection, setActiveSection] = useState<SectionId>('reasoning');

  if (!isOpen) return null;

  const sectionQuestions = questions.filter((q) => q.sectionId === activeSection);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h2 className="font-semibold text-base">Full Question Paper View</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {EXAM_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition ${
                activeSection === sec.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              {sec.name} ({sec.questionRange})
            </button>
          ))}
        </div>

        {/* Question List */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm divide-y divide-slate-200">
          {sectionQuestions.map((q) => {
            const index = questions.findIndex((item) => item.id === q.id);
            return (
              <div key={q.id} className="pt-4 first:pt-0 space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center font-bold">
                      {q.questionNumber}
                    </span>
                    <span>Q{q.questionNumber}.</span>
                  </div>

                  <button
                    onClick={() => {
                      onSelectQuestion(index);
                      onClose();
                    }}
                    className="px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition flex items-center gap-1 shrink-0"
                  >
                    <span>Go to Question</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {q.passage && (
                  <div className="p-3 bg-amber-50 rounded border border-amber-200 text-xs text-slate-700 italic">
                    {q.passage}
                  </div>
                )}

                <p className="text-slate-800 whitespace-pre-line leading-relaxed">{q.text}</p>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                  {q.options.map((opt) => (
                    <div
                      key={opt.id}
                      className="p-2 bg-slate-50 border border-slate-200 rounded flex items-center gap-2 text-slate-700"
                    >
                      <span className="font-bold text-slate-900 w-4">{opt.id})</span>
                      <span>{opt.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded border border-slate-300 transition"
          >
            Back to Mock
          </button>
        </div>
      </div>
    </div>
  );
};
