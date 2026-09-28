import React, { useState } from 'react';
import {
  Timer,
  Maximize2,
  Minimize2,
  PenTool,
  Type,
  FileText,
  Info,
  User,
  AlertCircle,
  HelpCircle,
  BarChart2,
  Layers,
  LogOut,
} from 'lucide-react';
import { SectionId, ExamTheme, FontSize, ExamLanguage, UserResponse } from '../types';
import { EXAM_SECTIONS } from '../data/mockExamData';
import { SymbolsModal } from './SymbolsModal';
import { OverallSummaryModal } from './OverallSummaryModal';

interface HeaderProps {
  currentSectionId: SectionId;
  onSelectSection: (sectionId: SectionId) => void;
  totalTimeRemaining: number; // in seconds
  sectionTimeRemaining: number; // in seconds
  isStrictSectionalTimer: boolean;
  onOpenInstructions: () => void;
  onOpenQuestionPaper: () => void;
  onSubmitClick: () => void;
  onOpenScratchpad: () => void;
  onExitExam?: () => void;
  examTitle?: string;
  availableSections?: SectionId[];
  onSaveAndNext?: () => void;
  onMarkForReviewAndNext?: () => void;
  language: ExamLanguage;
  onSelectLanguage: (lang: ExamLanguage) => void;
  fontSize: FontSize;
  onSelectFontSize: (size: FontSize) => void;
  theme: ExamTheme;
  onSelectTheme: (theme: ExamTheme) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  responses: Record<number, UserResponse>;
  candidateName?: string;
  candidateRoll?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentSectionId,
  onSelectSection,
  totalTimeRemaining,
  sectionTimeRemaining,
  isStrictSectionalTimer,
  onOpenInstructions,
  onOpenQuestionPaper,
  onSubmitClick,
  onOpenScratchpad,
  onExitExam,
  examTitle,
  availableSections,
  onSaveAndNext,
  onMarkForReviewAndNext,
  language,
  onSelectLanguage,
  fontSize,
  onSelectFontSize,
  theme,
  onSelectTheme,
  isFullscreen,
  onToggleFullscreen,
  responses,
  candidateName = 'aayush',
  candidateRoll = '709193****',
}) => {
  const [isSymbolsModalOpen, setIsSymbolsModalOpen] = useState(false);
  const [isOverallSummaryOpen, setIsOverallSummaryOpen] = useState(false);

  // Format digital countdown timer (e.g. 59:14)
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(Math.max(0, totalSeconds) / 60);
    const secs = Math.max(0, totalSeconds) % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate total questions answered across entire test
  let totalAnsweredCount = 0;
  Object.values(responses).forEach((resp) => {
    if (resp.status === 'answered' || resp.status === 'answered_and_marked') {
      totalAnsweredCount++;
    }
  });

  const currentSection = EXAM_SECTIONS.find((s) => s.id === currentSectionId) || EXAM_SECTIONS[0];
  const currentPartIndex = EXAM_SECTIONS.findIndex((s) => s.id === currentSectionId);
  const currentPartLetter = String.fromCharCode(65 + Math.max(0, currentPartIndex));

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800 shadow-2xs select-none">
      {/* 1. Top Bar: Exam Title, Candidate Roll, Digital Timer, Photo Thumbnails */}
      <div className="py-2 border-b border-slate-200 dark:border-slate-800">
        <div className="w-[90%] mx-auto flex items-center justify-between gap-3 flex-wrap">
          {/* Left: Exam Title */}
          <div className="flex items-center gap-3">
            <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm tracking-tight">
              {examTitle ? `${examTitle} — ${currentSection.name}` : `CGL Tier 1 — ${currentSection.name} — Based on 2025-2026 Trend`}
            </div>
          </div>

          {/* Center: Roll No: 709193**** [aayush] */}
          <div className="hidden md:flex items-center text-xs text-slate-700 dark:text-slate-300 font-medium">
            <span>
              Roll No: <strong className="font-mono">{candidateRoll}</strong> [{candidateName}]
            </span>
          </div>

          {/* Right: Digital Countdown Timer & Photo Thumbnails */}
          <div className="flex items-center gap-3">
            {/* Digital Timers */}
            <div className="flex items-center gap-2">
              {isStrictSectionalTimer && (
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border shadow-2xs ${
                    sectionTimeRemaining <= 120
                      ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-700 animate-pulse'
                      : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700'
                  }`}
                  title="Section Time Remaining (Strict 15-Minute Sectional Timer)"
                >
                  <span className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-300">
                    Section (15m):
                  </span>
                  <span className="font-mono text-sm sm:text-base font-black text-amber-800 dark:text-amber-300 tracking-wider">
                    {formatTime(sectionTimeRemaining)}
                  </span>
                </div>
              )}

              {/* Digital Timer (Red digits on white box matching screenshot) */}
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-2xs">
                <Timer className="w-4 h-4 text-rose-600 dark:text-rose-500" />
                <div className="flex items-center gap-1">
                  {isStrictSectionalTimer && (
                    <span className="text-[9px] uppercase font-bold text-slate-500 mr-0.5">Total:</span>
                  )}
                  <span className="font-mono text-base sm:text-lg font-black text-rose-600 dark:text-rose-500 tracking-wider">
                    {formatTime(totalTimeRemaining)}
                  </span>
                </div>
              </div>
            </div>

            {/* Registration & Captured Photo Thumbnails (Matching Screenshot) */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-center">
                <div className="w-8 h-8 rounded-sm bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                  <User className="w-5 h-5 text-slate-500" />
                </div>
                <span className="text-[9px] text-slate-500 block leading-tight mt-0.5 whitespace-nowrap">
                  Reg Photo
                </span>
              </div>

              <div className="text-center">
                <div className="w-8 h-8 rounded-sm bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-[9px] text-slate-500 block leading-tight mt-0.5 whitespace-nowrap">
                  Captured
                </span>
              </div>
            </div>

            {/* Quick Rough Sheet, Fullscreen & Exit Utilities */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={onOpenScratchpad}
                className="px-2 py-1 text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-400/50 rounded flex items-center gap-1 transition cursor-pointer"
                title="Open Rough Sheet"
              >
                <PenTool className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="hidden lg:inline">Rough Sheet</span>
              </button>

              <button
                onClick={onToggleFullscreen}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              {onExitExam && (
                <button
                  onClick={onExitExam}
                  className="px-2.5 py-1 text-xs font-bold bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 rounded flex items-center gap-1.5 transition cursor-pointer ml-1"
                  title="Exit Exam"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>Exit Exam</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Middle Row: Action Links & Red Auto-Save Notice (Matching Screenshot) */}
      <div className="bg-slate-50/70 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 py-1.5 text-xs">
        <div className="w-[90%] mx-auto flex items-center justify-between gap-2 flex-wrap">
          {/* Left Links: SYMBOLS | INSTRUCTIONS | OVERALL TEST SUMMARY */}
          <div className="flex items-center gap-3 sm:gap-4 font-bold">
            <button
              onClick={() => setIsSymbolsModalOpen(true)}
              className="text-blue-600 dark:text-blue-400 hover:underline tracking-tight cursor-pointer"
            >
              SYMBOLS
            </button>
            <button
              onClick={onOpenInstructions}
              className="text-amber-600 dark:text-amber-500 hover:underline tracking-tight cursor-pointer"
            >
              INSTRUCTIONS
            </button>
            <button
              onClick={() => setIsOverallSummaryOpen(true)}
              className="text-rose-600 dark:text-rose-500 hover:underline tracking-tight cursor-pointer"
            >
              OVERALL TEST SUMMARY
            </button>
          </div>

          {/* Center: "All questions are auto saved upon option selection" in bold red! */}
          <div className="text-center font-bold text-rose-600 dark:text-rose-400 text-xs tracking-tight">
            All questions are auto saved upon option selection
          </div>

          {/* Right: Question Paper popup */}
          <button
            onClick={onOpenQuestionPaper}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:underline text-xs flex items-center gap-1 cursor-pointer"
          >
            <FileText className="w-3 h-3 text-blue-500" />
            <span>Question Paper</span>
          </button>
        </div>
      </div>

      {/* 3. Sub-header Bar: PART-A badge, Central Blue Action Buttons, Answered Count (Matching Screenshot) */}
      <div className="bg-white dark:bg-slate-900 py-2 border-b border-slate-200 dark:border-slate-800">
        <div className="w-[90%] mx-auto flex items-center justify-between gap-3 flex-wrap">
          {/* Left: PART-A green pill badge */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-md shadow-2xs tracking-wide">
              PART-{currentPartLetter}
            </div>

            {/* Quick section switcher pills */}
            <div className="hidden lg:flex items-center gap-1 text-xs">
              {(availableSections && availableSections.length > 0
                ? EXAM_SECTIONS.filter((s) => availableSections.includes(s.id))
                : EXAM_SECTIONS
              ).map((sec, idx) => {
                const originalIdx = EXAM_SECTIONS.findIndex((s) => s.id === sec.id);
                const letter = String.fromCharCode(65 + (originalIdx >= 0 ? originalIdx : idx));
                const isActive = sec.id === currentSectionId;
                return (
                  <button
                    key={sec.id}
                    onClick={() => onSelectSection(sec.id)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    PART-{letter}: {sec.shortName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center: Blue Action Buttons (Mark for Review, Save & Next, Submit Test) */}
          <div className="flex items-center gap-2">
            {onMarkForReviewAndNext && (
              <button
                onClick={onMarkForReviewAndNext}
                className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-700 active:scale-95 text-white transition shadow-2xs cursor-pointer"
              >
                Mark for Review
              </button>
            )}

            {onSaveAndNext && (
              <button
                onClick={onSaveAndNext}
                className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-700 active:scale-95 text-white transition shadow-2xs cursor-pointer"
              >
                Save & Next
              </button>
            )}

            <button
              onClick={onSubmitClick}
              className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 dark:hover:bg-rose-950/50 dark:hover:text-rose-300 border border-slate-300 dark:border-slate-700 transition shadow-2xs cursor-pointer ml-2"
              title="Submit Test (Final exam submission)"
            >
              Submit Test
            </button>
          </div>

          {/* Right: Total Questions Answered: [ 0 ] */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-bold">
              Total Questions Answered:
            </span>
            <span className="w-6 h-6 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-mono font-bold text-xs flex items-center justify-center shadow-2xs">
              {totalAnsweredCount}
            </span>
          </div>
        </div>
      </div>

      {/* Modals triggered from Header */}
      <SymbolsModal
        isOpen={isSymbolsModalOpen}
        onClose={() => setIsSymbolsModalOpen(false)}
      />

      <OverallSummaryModal
        isOpen={isOverallSummaryOpen}
        onClose={() => setIsOverallSummaryOpen(false)}
        questions={EXAM_SECTIONS as any}
        responses={responses}
        timeRemainingSeconds={totalTimeRemaining}
      />
    </header>
  );
};
