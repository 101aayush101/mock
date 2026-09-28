import React, { useState } from 'react';
import { Question, UserResponse, FontSize, ExamTheme, ExamLanguage } from '../types';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Flag,
  Bookmark,
  Download,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { getLocalizedQuestion, getLocalizedOption } from '../data/bilingualHelper';
import { ReportModal } from './ReportModal';

interface QuestionAreaProps {
  question: Question;
  response?: UserResponse;
  onSelectOption: (optionId: 'A' | 'B' | 'C' | 'D') => void;
  fontSize: FontSize;
  theme: ExamTheme;
  language: ExamLanguage;
  onSelectLanguage: (lang: ExamLanguage) => void;
  zoomPercent: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  candidateRollWatermark?: string;
  onToggleBookmark?: () => void;
  isBookmarked?: boolean;
}

export const QuestionArea: React.FC<QuestionAreaProps> = ({
  question,
  response,
  onSelectOption,
  fontSize,
  theme,
  language,
  onSelectLanguage,
  zoomPercent,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  candidateRollWatermark = '709193****[aayush]',
  onToggleBookmark,
  isBookmarked = false,
}) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const selectedOption = response?.selectedOption || null;

  // Localized texts
  const localizedPrompt = getLocalizedQuestion(question.id, question.text, question.sectionId, language);

  // Dynamic zoom scale
  const zoomScale = zoomPercent / 100;

  // Base font size classes combined with zoom
  const getBaseFontSizeRem = () => {
    switch (fontSize) {
      case 'xlarge':
        return 1.2;
      case 'large':
        return 1.08;
      case 'normal':
      default:
        return 1.0;
    }
  };

  const calculatedFontSizePx = Math.round(16 * getBaseFontSizeRem() * zoomScale);

  // Generate repeating watermark rows
  const watermarkItems = Array.from({ length: 48 }, (_, i) => candidateRollWatermark);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-800 shadow-sm flex flex-col h-full overflow-hidden select-none relative">
      {/* Top Question Toolbar Matching Screenshot */}
      <div className="px-4 py-2.5 border-b border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between flex-wrap gap-2 text-xs z-10">
        {/* Left: Question Number (Overall + Sectional) | Report */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
              Question {question.questionNumber}
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-medium text-xs">/ 100</span>
          </div>

          <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-semibold">
            {question.sectionName} (Q{question.sectionQuestionNumber})
          </span>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline font-semibold text-xs flex items-center gap-1 cursor-pointer ml-1"
            title="Report this question"
          >
            Report
          </button>

          {/* Bookmark Flag button */}
          {onToggleBookmark && (
            <button
              onClick={onToggleBookmark}
              className={`px-2 py-0.5 rounded text-[11px] font-medium border flex items-center gap-1 transition ${
                isBookmarked
                  ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:text-amber-600'
              }`}
              title="Bookmark question"
            >
              <Bookmark className={`w-3 h-3 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{isBookmarked ? 'Flagged' : 'Flag'}</span>
            </button>
          )}
        </div>

        {/* Right Controls: Zoom Buttons + Download + Arrow + Language Selector */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Zoom in / Zoom out buttons (User explicitly requested!) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-300 dark:border-slate-700">
            <button
              onClick={onZoomOut}
              disabled={zoomPercent <= 75}
              className={`p-1 rounded text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition ${
                zoomPercent <= 75 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
              }`}
              title="Zoom Out (−)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onResetZoom}
              className="px-1.5 py-0.5 text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 transition"
              title="Click to reset zoom to 100%"
            >
              {zoomPercent}%
            </button>

            <button
              onClick={onZoomIn}
              disabled={zoomPercent >= 160}
              className={`p-1 rounded text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition ${
                zoomPercent >= 160 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
              }`}
              title="Zoom In (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Utility Icon (Save/Download icon & Arrow from screenshot) */}
          <div className="hidden sm:flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <button
              onClick={() => {}}
              className="p-1.5 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Save Question"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Language Selector Dropdown (Matching Screenshot: "Select Language: [English ▾]") */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium hidden sm:inline">
              Select Language:
            </span>
            <select
              value={language}
              onChange={(e) => onSelectLanguage(e.target.value as ExamLanguage)}
              className="px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-600 cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Question & Options Workspace with Watermark */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-7 relative select-text cbt-scrollbar">
        {/* Authentic Repeating Watermark (Matching Screenshot: 709193****[aayush]) */}
        <div className="cbt-watermark-text-pattern select-none">
          {watermarkItems.map((text, idx) => (
            <span key={idx} className="whitespace-nowrap tracking-wider">
              {text}
            </span>
          ))}
        </div>

        {/* Scalable Container controlled by Zoom In / Zoom Out */}
        <div
          style={{ fontSize: `${calculatedFontSizePx}px` }}
          className="relative z-10 space-y-6 w-full"
        >
          {/* Comprehension / Reading Reference Passage if present */}
          {question.passage && (
            <div className="rounded-lg p-4 bg-slate-50/90 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 leading-relaxed font-serif shadow-2xs">
              <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1.5 font-sans">
                Passage Reference:
              </div>
              <p className="whitespace-pre-line leading-relaxed">{question.passage}</p>
            </div>
          )}

          {/* Question Text Body */}
          <div className="font-medium text-slate-900 dark:text-slate-100 leading-relaxed tracking-normal font-sans">
            <div className="whitespace-pre-line">{localizedPrompt.text}</div>
          </div>

          {/* Options with full-width horizontal divider lines (Exact Layout from Screenshot) */}
          <div className="border-t border-slate-300 dark:border-slate-700 pt-1">
            {question.options.map((option) => {
              const isSelected = selectedOption === option.id;
              const localizedOptionText = getLocalizedOption(
                question.id,
                option.id,
                option.text,
                question.sectionId,
                language
              );

              return (
                <div
                  key={option.id}
                  onClick={() => onSelectOption(option.id)}
                  className={`border-b border-slate-300 dark:border-slate-700 py-3.5 px-2 flex items-center gap-4 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50/70 dark:bg-blue-950/40'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {/* Clean Round Radio Button (Matching Screenshot) */}
                  <div className="shrink-0">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-blue-700 bg-blue-700 text-white'
                          : 'border-slate-500 bg-white dark:bg-slate-800 dark:border-slate-400'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  {/* Option Text */}
                  <div className="flex-1 font-normal text-slate-900 dark:text-slate-100 leading-normal">
                    {localizedOptionText}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        questionNumber={question.sectionQuestionNumber || question.questionNumber}
      />
    </div>
  );
};
