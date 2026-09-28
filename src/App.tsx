import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MOCK_QUESTIONS, EXAM_SECTIONS } from './data/mockExamData';
import {
  Question,
  UserResponse,
  SectionId,
  QuestionStatus,
  ExamTheme,
  FontSize,
  ExamLanguage,
  AttemptRecord,
} from './types';
import { Header } from './components/Header';
import { QuestionArea } from './components/QuestionArea';
import { QuestionPalette } from './components/QuestionPalette';
import { ActionBar } from './components/ActionBar';
import { SubmitConfirmModal } from './components/SubmitConfirmModal';
import { InstructionsModal } from './components/InstructionsModal';
import { QuestionPaperModal } from './components/QuestionPaperModal';
import { AnalysisWindow } from './components/AnalysisWindow';
import { StartScreen } from './components/StartScreen';
import { ScratchpadModal } from './components/ScratchpadModal';
import { ExitConfirmModal } from './components/ExitConfirmModal';

const TOTAL_EXAM_TIME_SECONDS = 60 * 60; // 60 minutes = 3600 seconds
const SECTION_TIME_SECONDS = 15 * 60; // 15 minutes = 900 seconds

const STORAGE_KEY_ATTEMPT_HISTORY = 'ssc_cgl_attempt_history';
const STORAGE_KEY_THEME = 'ssc_cgl_theme';
const STORAGE_KEY_FONT_SIZE = 'ssc_cgl_fontsize';
const STORAGE_KEY_LANGUAGE = 'ssc_cgl_language';
const STORAGE_KEY_STARRED = 'ssc_cgl_starred_questions';

export default function App() {
  const [examMode, setExamMode] = useState<'start' | 'exam' | 'analysis'>('start');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [examTitle, setExamTitle] = useState<string>('SSC CGL 2026 — Trend-Based Mock 01');
  const [totalExamDuration, setTotalExamDuration] = useState<number>(TOTAL_EXAM_TIME_SECONDS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentSectionId, setCurrentSectionId] = useState<SectionId>('reasoning');
  const [responses, setResponses] = useState<Record<number, UserResponse>>({});
  const [totalTimeRemaining, setTotalTimeRemaining] = useState<number>(TOTAL_EXAM_TIME_SECONDS);
  const [sectionTimeRemaining, setSectionTimeRemaining] = useState<number>(SECTION_TIME_SECONDS);
  const [isStrictSectionalTimer, setIsStrictSectionalTimer] = useState<boolean>(false);
  const [filterPaletteSectionOnly, setFilterPaletteSectionOnly] = useState<boolean>(true);
  const [activeAttemptMode, setActiveAttemptMode] = useState<'full' | 'incorrect_and_skipped'>('full');
  const [zoomPercent, setZoomPercent] = useState<number>(100);

  // Reading & UI Display Customization States
  const [theme, setTheme] = useState<ExamTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      return (saved as ExamTheme) || 'cbt_master';
    } catch {
      return 'cbt_master';
    }
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FONT_SIZE);
      return (saved as FontSize) || 'normal';
    } catch {
      return 'normal';
    }
  });

  const [language, setLanguage] = useState<ExamLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANGUAGE);
      return (saved as ExamLanguage) || 'en';
    } catch {
      return 'en';
    }
  });

  const [isFullscreen, setIsFullscreen] = useState<boolean>(Boolean(document.fullscreenElement));

  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState<boolean>(false);
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState<boolean>(false);
  const [isQuestionPaperModalOpen, setIsQuestionPaperModalOpen] = useState<boolean>(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState<boolean>(false);

  // Bookmarking state
  const [starredQuestions, setStarredQuestions] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STARRED);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Re-attempt & History State
  const [attemptsHistory, setAttemptsHistory] = useState<AttemptRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ATTEMPT_HISTORY);
      if (saved) return JSON.parse(saved);

      // Legacy fallback
      const legacy = localStorage.getItem('ssc_cgl_last_exam_analysis');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        return [
          {
            id: 'legacy-attempt-1',
            attemptNumber: 1,
            timestamp: parsed.submittedAt
              ? new Date(parsed.submittedAt).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Previous Attempt',
            mode: 'full',
            totalQuestions: 100,
            score: 0,
            maxScore: 200,
            accuracy: 0,
            attempted: 0,
            correct: 0,
            incorrect: 0,
            unattempted: 100,
            timeSpentSeconds: parsed.timeSpent || 0,
            responses: parsed.responses || {},
            sectionBreakdown: {} as any,
          },
        ];
      }
      return [];
    } catch {
      return [];
    }
  });

  const [viewingAttemptIndex, setViewingAttemptIndex] = useState<number>(0);

  const timerRef = useRef<number | null>(null);

  // Persist display settings
  const handleSelectTheme = (newTheme: ExamTheme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY_THEME, newTheme);
    } catch {}
  };

  const handleSelectFontSize = (newSize: FontSize) => {
    setFontSize(newSize);
    try {
      localStorage.setItem(STORAGE_KEY_FONT_SIZE, newSize);
    } catch {}
  };

  const handleSelectLanguage = (newLang: ExamLanguage) => {
    setLanguage(newLang);
    try {
      localStorage.setItem(STORAGE_KEY_LANGUAGE, newLang);
    } catch {}
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Fullscreen change listener
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const handleToggleBookmark = (qId: number) => {
    setStarredQuestions((prev) => {
      const updated = { ...prev, [qId]: !prev[qId] };
      try {
        localStorage.setItem(STORAGE_KEY_STARRED, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Zoom In / Zoom Out Controls
  const handleZoomIn = () => {
    setZoomPercent((prev) => Math.min(160, prev + 10));
  };

  const handleZoomOut = () => {
    setZoomPercent((prev) => Math.max(75, prev - 10));
  };

  const handleResetZoom = () => {
    setZoomPercent(100);
  };

  // Active question
  const currentQuestion = activeQuestions[currentQuestionIndex] || activeQuestions[0];

  // Helper to mark visited
  const markQuestionVisited = useCallback((qIndex: number) => {
    const q = activeQuestions[qIndex];
    if (!q) return;

    setResponses((prev) => {
      const existing = prev[q.id];
      if (!existing || existing.status === 'not_visited') {
        return {
          ...prev,
          [q.id]: {
            questionId: q.id,
            selectedOption: existing?.selectedOption ?? null,
            status: 'not_answered',
            timeSpentSeconds: existing?.timeSpentSeconds ?? 0,
          },
        };
      }
      return prev;
    });
  }, [activeQuestions]);

  // Set current question with bounds and sync section tab
  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < activeQuestions.length) {
        setCurrentQuestionIndex(index);
        const targetQ = activeQuestions[index];
        if (targetQ && targetQ.sectionId !== currentSectionId) {
          setCurrentSectionId(targetQ.sectionId);
        }
        markQuestionVisited(index);
      }
    },
    [activeQuestions, currentSectionId, markQuestionVisited]
  );

  // Jump to first question of a section
  const handleSelectSection = (sectionId: SectionId) => {
    const targetIdx = activeQuestions.findIndex((q) => q.sectionId === sectionId);
    if (targetIdx !== -1) {
      setCurrentSectionId(sectionId);
      goToQuestion(targetIdx);
    }
  };

  // Start exam / Re-attempt handler
  const handleStartExam = (
    strictSectional: boolean,
    mode: 'full' | 'incorrect_and_skipped' = 'full'
  ) => {
    setActiveQuestions(MOCK_QUESTIONS);
    setExamTitle('SSC CGL 2026 — Trend-Based Mock 01');
    setTotalExamDuration(TOTAL_EXAM_TIME_SECONDS);
    setIsStrictSectionalTimer(strictSectional);
    setActiveAttemptMode(mode);
    setTotalTimeRemaining(TOTAL_EXAM_TIME_SECONDS);
    setSectionTimeRemaining(SECTION_TIME_SECONDS);
    setCurrentQuestionIndex(0);
    setCurrentSectionId('reasoning');

    // If re-attempting mistakes only, find which questions to reset
    const lastAttempt = attemptsHistory[attemptsHistory.length - 1];
    const initialResponses: Record<number, UserResponse> = {};

    MOCK_QUESTIONS.forEach((q, idx) => {
      let shouldReset = true;
      if (mode === 'incorrect_and_skipped' && lastAttempt) {
        const lastResp = lastAttempt.responses[q.id];
        const wasCorrect = lastResp?.selectedOption === q.correctOption;
        if (wasCorrect) {
          shouldReset = false; // preserve correct status or skip
        }
      }

      initialResponses[q.id] = {
        questionId: q.id,
        selectedOption: null,
        status: idx === 0 && shouldReset ? 'not_answered' : 'not_visited',
        timeSpentSeconds: 0,
      };
    });

    setResponses(initialResponses);
    setExamMode('exam');
  };

  // Start Custom Mock Exam Handler (Pasted questions)
  const handleStartCustomExam = (
    customQuestions: Question[],
    durationMinutes: number,
    title: string,
    strictTimer: boolean
  ) => {
    setActiveQuestions(customQuestions);
    setExamTitle(title || 'Custom Practice Mock');
    const durationSecs = durationMinutes * 60;
    setTotalExamDuration(durationSecs);
    setTotalTimeRemaining(durationSecs);
    setSectionTimeRemaining(Math.min(durationSecs, SECTION_TIME_SECONDS));
    setIsStrictSectionalTimer(strictTimer);
    setActiveAttemptMode('full');
    setCurrentQuestionIndex(0);
    setCurrentSectionId(customQuestions[0]?.sectionId || 'reasoning');

    const initialResponses: Record<number, UserResponse> = {};
    customQuestions.forEach((q, idx) => {
      initialResponses[q.id] = {
        questionId: q.id,
        selectedOption: null,
        status: idx === 0 ? 'not_answered' : 'not_visited',
        timeSpentSeconds: 0,
      };
    });

    setResponses(initialResponses);
    setExamMode('exam');
  };

  // Start Sectional Mock Exam Handler (for any of the 4 standard subjects)
  const handleStartSectionalExam = (sectionId: SectionId) => {
    const secConfig = EXAM_SECTIONS.find((s) => s.id === sectionId) || EXAM_SECTIONS[0];
    const sectionalQuestions = MOCK_QUESTIONS.filter((q) => q.sectionId === sectionId).map((q, idx) => ({
      ...q,
      sectionQuestionNumber: idx + 1,
    }));

    const durationSecs = 15 * 60; // 15 minutes for 25 questions sectional mock
    setActiveQuestions(sectionalQuestions);
    setExamTitle(`SSC CGL 2026 — ${secConfig.name} Sectional Mock`);
    setTotalExamDuration(durationSecs);
    setTotalTimeRemaining(durationSecs);
    setSectionTimeRemaining(durationSecs);
    setIsStrictSectionalTimer(false);
    setActiveAttemptMode('full');
    setCurrentQuestionIndex(0);
    setCurrentSectionId(sectionId);

    const initialResponses: Record<number, UserResponse> = {};
    sectionalQuestions.forEach((q, idx) => {
      initialResponses[q.id] = {
        questionId: q.id,
        selectedOption: null,
        status: idx === 0 ? 'not_answered' : 'not_visited',
        timeSpentSeconds: 0,
      };
    });

    setResponses(initialResponses);
    setExamMode('exam');
  };

  // View past exam analysis
  const handleViewPastAttempt = (attemptIndex?: number) => {
    const idx = attemptIndex !== undefined ? attemptIndex : attemptsHistory.length - 1;
    if (attemptsHistory[idx]) {
      setViewingAttemptIndex(idx);
      setResponses(attemptsHistory[idx].responses || {});
      setExamMode('analysis');
    }
  };

  const handleClearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_ATTEMPT_HISTORY);
      localStorage.removeItem('ssc_cgl_last_exam_analysis');
    } catch {}
    setAttemptsHistory([]);
  };

  // Final Submit Test
  const handleFinalSubmit = useCallback(() => {
    setIsSubmitModalOpen(false);

    const timeSpent = totalExamDuration - totalTimeRemaining;

    // Calculate attempt scores
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalUnattempted = 0;
    let totalMarks = 0;

    const sectionMetrics: Record<
      SectionId,
      { total: number; correct: number; incorrect: number; attempted: number; score: number }
    > = {
      reasoning: { total: 0, correct: 0, incorrect: 0, attempted: 0, score: 0 },
      general_awareness: { total: 0, correct: 0, incorrect: 0, attempted: 0, score: 0 },
      quant: { total: 0, correct: 0, incorrect: 0, attempted: 0, score: 0 },
      english: { total: 0, correct: 0, incorrect: 0, attempted: 0, score: 0 },
    };

    activeQuestions.forEach((q) => {
      const resp = responses[q.id];
      const sec = sectionMetrics[q.sectionId] || sectionMetrics.reasoning;
      sec.total += 1;

      const userChoice = resp?.selectedOption;
      const isAttempted =
        userChoice !== null &&
        userChoice !== undefined &&
        (resp?.status === 'answered' || resp?.status === 'answered_and_marked');

      if (!isAttempted) {
        totalUnattempted += 1;
      } else if (userChoice === q.correctOption) {
        totalCorrect += 1;
        totalMarks += 2.0;
        sec.correct += 1;
        sec.attempted += 1;
        sec.score += 2.0;
      } else {
        totalIncorrect += 1;
        totalMarks -= 0.5;
        sec.incorrect += 1;
        sec.attempted += 1;
        sec.score -= 0.5;
      }
    });

    const netScore = Math.max(0, totalMarks);
    const attemptedCount = totalCorrect + totalIncorrect;
    const accuracy = attemptedCount > 0 ? (totalCorrect / attemptedCount) * 100 : 0;

    const newAttempt: AttemptRecord = {
      id: `attempt-${Date.now()}`,
      attemptNumber: attemptsHistory.length + 1,
      timestamp: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      mode: activeAttemptMode,
      totalQuestions: activeQuestions.length,
      score: netScore,
      maxScore: activeQuestions.length * 2,
      accuracy,
      attempted: attemptedCount,
      correct: totalCorrect,
      incorrect: totalIncorrect,
      unattempted: totalUnattempted,
      timeSpentSeconds: timeSpent,
      responses,
      sectionBreakdown: sectionMetrics,
    };

    const updatedHistory = [...attemptsHistory, newAttempt];
    setAttemptsHistory(updatedHistory);
    setViewingAttemptIndex(updatedHistory.length - 1);

    try {
      localStorage.setItem(STORAGE_KEY_ATTEMPT_HISTORY, JSON.stringify(updatedHistory));
      localStorage.setItem(
        'ssc_cgl_last_exam_analysis',
        JSON.stringify({
          responses,
          totalTimeRemaining,
          timeSpent,
          submittedAt: new Date().toISOString(),
        })
      );
    } catch (e) {
      console.error('Failed to persist exam attempt', e);
    }

    setExamMode('analysis');
  }, [responses, totalTimeRemaining, totalExamDuration, attemptsHistory, activeAttemptMode, activeQuestions]);

  // Main countdown timer effect
  useEffect(() => {
    if (examMode !== 'exam') return;

    timerRef.current = window.setInterval(() => {
      // Track time spent on current question
      setResponses((prev) => {
        const activeQ = activeQuestions[currentQuestionIndex];
        if (!activeQ) return prev;
        const current = prev[activeQ.id];
        return {
          ...prev,
          [activeQ.id]: {
            ...current,
            questionId: activeQ.id,
            selectedOption: current?.selectedOption ?? null,
            status: current?.status ?? 'not_answered',
            timeSpentSeconds: (current?.timeSpentSeconds || 0) + 1,
          },
        };
      });

      // Update total remaining time
      setTotalTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current!);
          handleFinalSubmit();
          return 0;
        }
        return prevTime - 1;
      });

      // Update sectional time if strict mode is active
      if (isStrictSectionalTimer) {
        setSectionTimeRemaining((prevSecTime) => {
          if (prevSecTime <= 1) {
            // Auto advance section
            const sectionsOrder: SectionId[] = ['reasoning', 'general_awareness', 'quant', 'english'];
            const currentIndex = sectionsOrder.indexOf(currentSectionId);
            if (currentIndex < sectionsOrder.length - 1) {
              const nextSec = sectionsOrder[currentIndex + 1];
              handleSelectSection(nextSec);
              return SECTION_TIME_SECONDS;
            } else {
              // Last section finished in strict mode -> Auto submit
              handleFinalSubmit();
              return 0;
            }
          }
          return prevSecTime - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examMode, isStrictSectionalTimer, currentQuestionIndex, currentSectionId, handleFinalSubmit, activeQuestions]);

  // Option selection
  const handleSelectOption = (optionId: 'A' | 'B' | 'C' | 'D') => {
    const qId = currentQuestion.id;
    setResponses((prev) => {
      const current = prev[qId];
      const isAlreadySelected = current?.selectedOption === optionId;
      const newOption = isAlreadySelected ? null : optionId;

      return {
        ...prev,
        [qId]: {
          questionId: qId,
          selectedOption: newOption,
          status: newOption
            ? current?.status === 'marked_for_review' || current?.status === 'answered_and_marked'
              ? 'answered_and_marked'
              : 'answered'
            : current?.status === 'answered_and_marked'
            ? 'marked_for_review'
            : 'not_answered',
          timeSpentSeconds: current?.timeSpentSeconds || 0,
        },
      };
    });
  };

  // Action Bar Handlers
  const handleSaveAndNext = () => {
    const qId = currentQuestion.id;
    const currentResp = responses[qId];

    let finalStatus: QuestionStatus = 'not_answered';
    if (currentResp?.selectedOption) {
      finalStatus = 'answered';
    }

    setResponses((prev) => ({
      ...prev,
      [qId]: {
        questionId: qId,
        selectedOption: currentResp?.selectedOption ?? null,
        status: finalStatus,
        timeSpentSeconds: currentResp?.timeSpentSeconds || 0,
      },
    }));

    if (currentQuestionIndex < activeQuestions.length - 1) {
      goToQuestion(currentQuestionIndex + 1);
    }
  };

  const handleClearResponse = () => {
    const qId = currentQuestion.id;
    setResponses((prev) => ({
      ...prev,
      [qId]: {
        questionId: qId,
        selectedOption: null,
        status: 'not_answered',
        timeSpentSeconds: prev[qId]?.timeSpentSeconds || 0,
      },
    }));
  };

  const handleMarkForReviewAndNext = () => {
    const qId = currentQuestion.id;
    const currentResp = responses[qId];

    const hasOption = Boolean(currentResp?.selectedOption);
    const finalStatus: QuestionStatus = hasOption ? 'answered_and_marked' : 'marked_for_review';

    setResponses((prev) => ({
      ...prev,
      [qId]: {
        questionId: qId,
        selectedOption: currentResp?.selectedOption ?? null,
        status: finalStatus,
        timeSpentSeconds: currentResp?.timeSpentSeconds || 0,
      },
    }));

    if (currentQuestionIndex < activeQuestions.length - 1) {
      goToQuestion(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      goToQuestion(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      goToQuestion(currentQuestionIndex + 1);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (examMode !== 'exam') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        isSubmitModalOpen ||
        isInstructionsModalOpen ||
        isQuestionPaperModalOpen ||
        isScratchpadOpen
      )
        return;

      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key)) {
        handleSelectOption(key as 'A' | 'B' | 'C' | 'D');
      } else if (['1', '2', '3', '4'].includes(key)) {
        const map: Record<string, 'A' | 'B' | 'C' | 'D'> = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
        handleSelectOption(map[key]);
      } else if (e.key === 'Enter') {
        handleSaveAndNext();
      } else if (key === 'M') {
        handleMarkForReviewAndNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Re-attempt examination
  const handleReattempt = (mode: 'full' | 'incorrect_and_skipped' = 'full') => {
    if (activeQuestions === MOCK_QUESTIONS) {
      handleStartExam(isStrictSectionalTimer, mode);
    } else {
      handleStartCustomExam(
        activeQuestions,
        Math.ceil(totalExamDuration / 60),
        examTitle,
        isStrictSectionalTimer
      );
    }
  };

  // 1. Start Screen
  if (examMode === 'start') {
    return (
      <StartScreen
        onStartExam={handleStartExam}
        onStartSectionalExam={handleStartSectionalExam}
        onStartCustomExam={handleStartCustomExam}
        onViewPastAttempt={handleViewPastAttempt}
        attemptsHistory={attemptsHistory}
        onClearHistory={handleClearHistory}
      />
    );
  }

  // 2. Post-Exam Analysis Window
  if (examMode === 'analysis') {
    const activeAttempt = attemptsHistory[viewingAttemptIndex];
    const displayResponses = activeAttempt ? activeAttempt.responses : responses;
    const timeUsed = activeAttempt ? activeAttempt.timeSpentSeconds : totalExamDuration - totalTimeRemaining;

    return (
      <AnalysisWindow
        questions={activeQuestions}
        responses={displayResponses}
        totalTimeSpentSeconds={timeUsed}
        onReattemptExam={handleReattempt}
        attemptsHistory={attemptsHistory}
        currentAttemptIndex={viewingAttemptIndex}
        onSelectAttempt={(idx) => {
          setViewingAttemptIndex(idx);
          if (attemptsHistory[idx]) {
            setResponses(attemptsHistory[idx].responses);
          }
        }}
        onBackToHome={() => setExamMode('start')}
        examTitle={examTitle}
      />
    );
  }

  // 3. Active CBT Exam Interface
  const rootThemeClass =
    theme === 'dark'
      ? 'dark bg-slate-950 text-slate-100'
      : theme === 'tcs'
      ? 'bg-[#e2e8f0] text-slate-900 font-sans'
      : 'bg-[#eaeff5] text-slate-900 font-sans';

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden select-none ${rootThemeClass}`}>
      {/* Top Header with Timers, Sections, and Reading Controls */}
      <Header
        currentSectionId={currentSectionId}
        onSelectSection={handleSelectSection}
        totalTimeRemaining={totalTimeRemaining}
        sectionTimeRemaining={sectionTimeRemaining}
        isStrictSectionalTimer={isStrictSectionalTimer}
        onOpenInstructions={() => setIsInstructionsModalOpen(true)}
        onOpenQuestionPaper={() => setIsQuestionPaperModalOpen(true)}
        onSubmitClick={() => setIsSubmitModalOpen(true)}
        onOpenScratchpad={() => setIsScratchpadOpen(true)}
        onExitExam={() => setIsExitModalOpen(true)}
        examTitle={examTitle}
        availableSections={Array.from(new Set(activeQuestions.map((q) => q.sectionId)))}
        onSaveAndNext={handleSaveAndNext}
        onMarkForReviewAndNext={handleMarkForReviewAndNext}
        language={language}
        onSelectLanguage={handleSelectLanguage}
        fontSize={fontSize}
        onSelectFontSize={handleSelectFontSize}
        theme={theme}
        onSelectTheme={handleSelectTheme}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        responses={responses}
        candidateName="aayush"
        candidateRoll="709193****"
      />

      {/* Main Workspace Area: Uses 90% of screen */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden py-2 sm:py-3 gap-3 w-[90%] mx-auto">
        {/* Left Side: Question Display Area */}
        <div className="flex-1 h-full min-w-0">
          <QuestionArea
            question={currentQuestion}
            response={responses[currentQuestion.id]}
            onSelectOption={handleSelectOption}
            fontSize={fontSize}
            theme={theme}
            language={language}
            onSelectLanguage={handleSelectLanguage}
            zoomPercent={zoomPercent}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetZoom={handleResetZoom}
            candidateRollWatermark="709193****[aayush]"
            onToggleBookmark={() => handleToggleBookmark(currentQuestion.id)}
            isBookmarked={Boolean(starredQuestions[currentQuestion.id])}
          />
        </div>

        {/* Right Side: TCS / Oliveboard / Testbook Question Palette */}
        <div className="w-full md:w-80 lg:w-96 shrink-0 h-64 md:h-full">
          <QuestionPalette
            questions={activeQuestions}
            currentQuestionIndex={currentQuestionIndex}
            currentSectionId={currentSectionId}
            onSelectSection={handleSelectSection}
            responses={responses}
            onSelectQuestion={goToQuestion}
            filterSectionOnly={filterPaletteSectionOnly}
            onToggleFilterSection={() => setFilterPaletteSectionOnly(!filterPaletteSectionOnly)}
            theme={theme}
            starredQuestions={starredQuestions}
          />
        </div>
      </main>

      {/* Bottom Sticky Action Bar */}
      <ActionBar
        onSaveAndNext={handleSaveAndNext}
        onClearResponse={handleClearResponse}
        onMarkForReviewAndNext={handleMarkForReviewAndNext}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={() => setIsSubmitModalOpen(true)}
        onOpenScratchpad={() => setIsScratchpadOpen(true)}
        onExitExam={() => setIsExitModalOpen(true)}
        hasPrevious={currentQuestionIndex > 0}
        hasNext={currentQuestionIndex < activeQuestions.length - 1}
        hasSelection={Boolean(responses[currentQuestion.id]?.selectedOption)}
        theme={theme}
      />

      {/* Modals */}
      <SubmitConfirmModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirmSubmit={handleFinalSubmit}
        questions={activeQuestions}
        responses={responses}
        timeRemaining={totalTimeRemaining}
      />

      <ExitConfirmModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirmExitWithoutSave={() => {
          setIsExitModalOpen(false);
          setExamMode('start');
        }}
        onSubmitAndExit={() => {
          setIsExitModalOpen(false);
          handleFinalSubmit();
        }}
        totalQuestions={activeQuestions.length}
        responses={responses}
        timeRemaining={totalTimeRemaining}
      />

      <InstructionsModal
        isOpen={isInstructionsModalOpen}
        onClose={() => setIsInstructionsModalOpen(false)}
      />

      <QuestionPaperModal
        isOpen={isQuestionPaperModalOpen}
        onClose={() => setIsQuestionPaperModalOpen(false)}
        questions={activeQuestions}
        onSelectQuestion={goToQuestion}
      />

      {/* Digital Scratchpad / Rough Sheet */}
      <ScratchpadModal
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
      />
    </div>
  );
}
