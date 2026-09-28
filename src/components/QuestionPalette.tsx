import React, { useState, useRef, useEffect } from 'react';
import { Question, QuestionStatus, UserResponse, SectionId, ExamTheme } from '../types';
import { Camera, CameraOff, Video, ShieldCheck, AlertCircle } from 'lucide-react';
import { EXAM_SECTIONS } from '../data/mockExamData';

interface QuestionPaletteProps {
  questions: Question[];
  currentQuestionIndex: number;
  currentSectionId: SectionId;
  onSelectSection: (sectionId: SectionId) => void;
  responses: Record<number, UserResponse>;
  onSelectQuestion: (index: number) => void;
  filterSectionOnly: boolean;
  onToggleFilterSection: () => void;
  theme?: ExamTheme;
  starredQuestions?: Record<number, boolean>;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  questions,
  currentQuestionIndex,
  currentSectionId,
  onSelectSection,
  responses,
  onSelectQuestion,
  filterSectionOnly,
  onToggleFilterSection,
  theme = 'cbt_master',
  starredQuestions = {},
}) => {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [useSimulatedCamera, setUseSimulatedCamera] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Identify current section meta
  const currentSection = EXAM_SECTIONS.find((s) => s.id === currentSectionId) || EXAM_SECTIONS[0];
  const currentPartIndex = EXAM_SECTIONS.findIndex((s) => s.id === currentSectionId);
  const currentPartLetter = String.fromCharCode(65 + Math.max(0, currentPartIndex)); // 'A', 'B', 'C', 'D'

  // Calculate Section specific counts (for the PART-X Analysis card shown in screenshot)
  let sectionAnswered = 0;
  let sectionNotAnswered = 0;
  let sectionMarked = 0;
  let sectionNotVisited = 0;

  for (let i = currentSection.startNumber; i <= currentSection.endNumber; i++) {
    const status = responses[i]?.status || 'not_visited';
    if (status === 'answered' || status === 'answered_and_marked') {
      sectionAnswered++;
    } else if (status === 'not_answered') {
      sectionNotAnswered++;
    } else if (status === 'marked_for_review') {
      sectionMarked++;
    } else {
      sectionNotVisited++;
    }
  }

  // Camera Handler
  const handleToggleCamera = async () => {
    if (isCameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsCameraActive(false);
      setUseSimulatedCamera(false);
      setCameraError(null);
      return;
    }

    try {
      setCameraError(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 320 }, height: { ideal: 240 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
        setUseSimulatedCamera(false);
      } else {
        throw new Error('MediaDevices not supported in current environment');
      }
    } catch (err: any) {
      console.warn('Webcam permission note:', err);
      // Show realistic permission denied note just like screenshot, but allow instant fallback simulation!
      setCameraError('Camera permission denied. Please allow camera access in browser settings.');
      setIsCameraActive(true);
      setUseSimulatedCamera(true);
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Check which sections exist in current questions set
  const availableSectionIds = Array.from(new Set(questions.map((q) => q.sectionId)));
  const relevantSections = EXAM_SECTIONS.filter((s) => availableSectionIds.includes(s.id));
  const isSingleSectionExam = relevantSections.length <= 1;

  // Filter questions according to section or all
  const displayedQuestions =
    filterSectionOnly && !isSingleSectionExam
      ? questions.filter((q) => q.sectionId === currentSectionId)
      : questions;

  // Status-based button styling matching screenshot & SSC CBT palette
  const getQuestionButtonClass = (status: QuestionStatus, isCurrent: boolean) => {
    const base =
      'h-8 w-full rounded-md font-bold text-xs flex items-center justify-center transition-all cursor-pointer select-none font-mono relative shadow-xs';
    const activeOutline = isCurrent
      ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-105 z-10 shadow-md'
      : 'hover:brightness-110 active:scale-95';

    switch (status) {
      case 'answered':
        return `${base} bg-emerald-600 text-white ${activeOutline}`;
      case 'not_answered':
        return `${base} bg-rose-600 text-white ${activeOutline}`;
      case 'marked_for_review':
        return `${base} bg-purple-600 text-white ${activeOutline}`;
      case 'answered_and_marked':
        return `${base} bg-purple-600 text-white ${activeOutline}`;
      case 'not_visited':
      default:
        // In the screenshot: unvisited buttons are crisp bright royal blue!
        return `${base} bg-[#0a25e6] hover:bg-[#1a38ff] text-white ${activeOutline}`;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-800 shadow-sm flex flex-col h-full overflow-hidden select-none">
      {/* 1. Accordion Section Header & Part Switcher */}
      <div className="border-b border-slate-300 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/80">
        <div className="p-2.5 space-y-2">
          {/* Section Name & Range Indicator */}
          <div className="flex items-center justify-between">
            <span className="text-slate-900 dark:text-white font-bold text-xs sm:text-[13px] tracking-tight truncate">
              {isSingleSectionExam
                ? currentSection.name
                : filterSectionOnly
                ? `${currentSection.name} (${currentSection.questionRange})`
                : `All Sections (${questions.length} Qs)`}
            </span>
            <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 shrink-0">
              {isSingleSectionExam
                ? `${questions.length} Qs`
                : filterSectionOnly
                ? `PART-${currentPartLetter}`
                : `${questions.length} Qs`}
            </span>
          </div>

          {/* Quick Section Tabs (Only if more than 1 section exists) */}
          {!isSingleSectionExam && (
            <div className="flex flex-wrap gap-1 text-[11px] font-semibold">
              {relevantSections.map((sec, idx) => {
                const originalIdx = EXAM_SECTIONS.findIndex((s) => s.id === sec.id);
                const letter = String.fromCharCode(65 + (originalIdx >= 0 ? originalIdx : idx));
                const isActive = filterSectionOnly && sec.id === currentSectionId;
                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      if (!filterSectionOnly) onToggleFilterSection();
                      onSelectSection(sec.id);
                    }}
                    className={`flex-1 min-w-[40px] py-1 px-1 rounded text-center transition cursor-pointer font-bold ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-200/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                    }`}
                    title={`${sec.name}`}
                  >
                    P-{letter}
                  </button>
                );
              })}

              <button
                onClick={onToggleFilterSection}
                className={`flex-1 min-w-[40px] py-1 px-1 rounded text-center transition cursor-pointer font-bold ${
                  !filterSectionOnly
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-200/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                }`}
                title="Show all questions"
              >
                All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. All Questions Grid (5 Columns exact layout matching screenshot) */}
      <div className="p-3 flex-1 overflow-y-auto cbt-scrollbar">
        <div className="grid grid-cols-5 gap-2">
          {displayedQuestions.map((q) => {
            const actualIndex = questions.findIndex((item) => item.id === q.id);
            const status = responses[q.id]?.status || 'not_visited';
            const isCurrent = actualIndex === currentQuestionIndex;
            const isStarred = Boolean(starredQuestions[q.id]);

            return (
              <button
                key={q.id}
                onClick={() => onSelectQuestion(actualIndex)}
                className={getQuestionButtonClass(status, isCurrent)}
                title={`Question ${q.questionNumber} (${status.replace(/_/g, ' ')})`}
              >
                <span>{q.questionNumber}</span>

                {/* Answered and Marked Dot Indicator */}
                {status === 'answered_and_marked' && (
                  <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 border border-white" />
                )}

                {/* Flagged / Starred Corner */}
                {isStarred && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 border border-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. PART-A / Section Analysis Summary Box (Matching Screenshot) */}
      <div className="p-3 border-t border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/90">
        <div className="border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900 shadow-2xs">
          {/* Analysis Card Header */}
          <div className="bg-slate-200/80 dark:bg-slate-800/80 px-3 py-1.5 text-center font-bold text-xs text-slate-800 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700 tracking-wide">
            PART-{currentPartLetter} Analysis
          </div>

          {/* Analysis Rows */}
          <div className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
            {/* Answered */}
            <div className="px-3 py-1.5 flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Answered</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                {sectionAnswered}
              </span>
            </div>

            {/* Not Answered */}
            <div className="px-3 py-1.5 flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Not Answered</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                {sectionNotAnswered}
              </span>
            </div>

            {/* Mark For Review */}
            <div className="px-3 py-1.5 flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Mark For Review</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                {sectionMarked}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Enable Camera / Proctoring Card (Matching Screenshot) */}
        <div className="mt-2.5">
          <button
            onClick={handleToggleCamera}
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm cursor-pointer ${
              isCameraActive
                ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                : 'bg-[#2d3a5a] hover:bg-[#39496f] text-white'
            }`}
          >
            {isCameraActive ? (
              <>
                <Camera className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                <span>Camera Enabled</span>
              </>
            ) : (
              <>
                <Video className="w-3.5 h-3.5" />
                <span>Enable Camera</span>
              </>
            )}
          </button>

          {/* Video stream container when enabled */}
          {isCameraActive && (
            <div className="mt-2 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-950 relative aspect-4/3 flex items-center justify-center">
              {useSimulatedCamera ? (
                <div className="text-center p-3 text-slate-300">
                  <div className="w-10 h-10 mx-auto rounded-full bg-blue-600/30 border border-blue-400 flex items-center justify-center mb-1 text-blue-300">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-[11px] font-bold text-white">AI Proctoring Active</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">Face aligned in frame</div>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                />
              )}
              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-rose-600 text-white text-[9px] font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                REC
              </span>
            </div>
          )}

          {/* Permission Error / Warning Callout Box (Matching Screenshot bottom right notice) */}
          {cameraError && !useSimulatedCamera && (
            <div className="mt-2 p-2 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-md text-[10px] text-rose-700 dark:text-rose-300 flex items-start gap-1.5 leading-tight">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600 mt-0.5" />
              <span>{cameraError}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
