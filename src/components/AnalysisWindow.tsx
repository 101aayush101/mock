import React, { useState, useMemo } from 'react';
import { Question, UserResponse, SectionId, AttemptRecord, FontSize, ExamLanguage } from '../types';
import { EXAM_SECTIONS } from '../data/mockExamData';
import { getLocalizedQuestion, getLocalizedOption } from '../data/bilingualHelper';
import {
  Trophy,
  Target,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Printer,
  ChevronDown,
  ChevronUp,
  Filter,
  Bookmark,
  Sparkles,
  TrendingUp,
  Award,
  Search,
  Type,
  Languages,
  Home,
  ArrowUpRight,
} from 'lucide-react';

interface AnalysisWindowProps {
  questions: Question[];
  responses: Record<number, UserResponse>;
  totalTimeSpentSeconds: number;
  onReattemptExam: (mode?: 'full' | 'incorrect_and_skipped') => void;
  attemptsHistory?: AttemptRecord[];
  currentAttemptIndex?: number;
  onSelectAttempt?: (index: number) => void;
  onBackToHome?: () => void;
  examTitle?: string;
}

export const AnalysisWindow: React.FC<AnalysisWindowProps> = ({
  questions,
  responses,
  totalTimeSpentSeconds,
  onReattemptExam,
  attemptsHistory = [],
  currentAttemptIndex = 0,
  onSelectAttempt,
  onBackToHome,
  examTitle,
}) => {
  // Filters & State
  const [selectedSection, setSelectedSection] = useState<SectionId | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'incorrect' | 'unattempted' | 'correct' | 'marked'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [solutionFontSize, setSolutionFontSize] = useState<FontSize>('normal');
  const [solutionLang, setSolutionLang] = useState<ExamLanguage>('en');
  const [expandedExplanations, setExpandedExplanations] = useState<Record<number, boolean>>({});
  const [showReattemptMenu, setShowReattemptMenu] = useState<boolean>(false);

  const [starredQuestions, setStarredQuestions] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('ssc_cgl_starred_questions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleStar = (qId: number) => {
    setStarredQuestions((prev) => {
      const updated = { ...prev, [qId]: !prev[qId] };
      try {
        localStorage.setItem('ssc_cgl_starred_questions', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const toggleExplanation = (qId: number) => {
    setExpandedExplanations((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  // Expand or collapse all
  const expandAll = () => {
    const all: Record<number, boolean> = {};
    questions.forEach((q) => {
      all[q.id] = true;
    });
    setExpandedExplanations(all);
  };

  const collapseAll = () => {
    setExpandedExplanations({});
  };

  // Compute stats
  const analysisData = useMemo(() => {
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalUnattempted = 0;
    let totalMarks = 0;
    let totalNegativePenalty = 0;

    const sectionMetrics: Record<
      SectionId,
      {
        total: number;
        correct: number;
        incorrect: number;
        unattempted: number;
        score: number;
        timeSpent: number;
      }
    > = {
      reasoning: { total: 0, correct: 0, incorrect: 0, unattempted: 0, score: 0, timeSpent: 0 },
      general_awareness: { total: 0, correct: 0, incorrect: 0, unattempted: 0, score: 0, timeSpent: 0 },
      quant: { total: 0, correct: 0, incorrect: 0, unattempted: 0, score: 0, timeSpent: 0 },
      english: { total: 0, correct: 0, incorrect: 0, unattempted: 0, score: 0, timeSpent: 0 },
    };

    questions.forEach((q) => {
      const resp = responses[q.id];
      const sec = sectionMetrics[q.sectionId];
      sec.total += 1;
      sec.timeSpent += resp?.timeSpentSeconds || 0;

      const userChoice = resp?.selectedOption;
      const isAttempted =
        userChoice !== null &&
        userChoice !== undefined &&
        (resp?.status === 'answered' || resp?.status === 'answered_and_marked');

      if (!isAttempted) {
        totalUnattempted += 1;
        sec.unattempted += 1;
      } else if (userChoice === q.correctOption) {
        totalCorrect += 1;
        totalMarks += 2.0;
        sec.correct += 1;
        sec.score += 2.0;
      } else {
        totalIncorrect += 1;
        totalMarks -= 0.5;
        totalNegativePenalty += 0.5;
        sec.incorrect += 1;
        sec.score -= 0.5;
      }
    });

    const netScore = Math.max(0, totalMarks);
    const attemptedCount = totalCorrect + totalIncorrect;
    const accuracy = attemptedCount > 0 ? (totalCorrect / attemptedCount) * 100 : 0;

    // Percentile & cut-off prediction benchmark (relative to recent SSC Tier-I trends)
    let predictedPercentile = 0;
    if (netScore >= 165) predictedPercentile = 99.2;
    else if (netScore >= 150) predictedPercentile = 96.5;
    else if (netScore >= 135) predictedPercentile = 91.0;
    else if (netScore >= 120) predictedPercentile = 82.5;
    else if (netScore >= 100) predictedPercentile = 70.0;
    else predictedPercentile = Math.max(10, Math.round((netScore / 100) * 60));

    return {
      netScore,
      totalCorrect,
      totalIncorrect,
      totalUnattempted,
      attemptedCount,
      accuracy,
      totalNegativePenalty,
      predictedPercentile,
      sectionMetrics,
    };
  }, [questions, responses]);

  // Filter questions for the solution list
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Section filter
      if (selectedSection !== 'all' && q.sectionId !== selectedSection) {
        return false;
      }

      const resp = responses[q.id];
      const userChoice = resp?.selectedOption;
      const isAttempted =
        userChoice !== null &&
        userChoice !== undefined &&
        (resp?.status === 'answered' || resp?.status === 'answered_and_marked');

      const isCorrect = isAttempted && userChoice === q.correctOption;
      const isIncorrect = isAttempted && userChoice !== q.correctOption;
      const isUnattempted = !isAttempted;
      const isMarked = Boolean(starredQuestions[q.id]) || resp?.status === 'marked_for_review' || resp?.status === 'answered_and_marked';

      if (statusFilter === 'incorrect' && !isIncorrect) return false;
      if (statusFilter === 'unattempted' && !isUnattempted) return false;
      if (statusFilter === 'correct' && !isCorrect) return false;
      if (statusFilter === 'marked' && !isMarked) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesText = q.text.toLowerCase().includes(query);
        const matchesTopic = q.topic.toLowerCase().includes(query);
        const matchesExpl = q.explanation.toLowerCase().includes(query);
        if (!matchesText && !matchesTopic && !matchesExpl) return false;
      }

      return true;
    });
  }, [questions, responses, selectedSection, statusFilter, searchQuery, starredQuestions]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  const handlePrint = () => {
    window.print();
  };

  const fontSizeClass =
    solutionFontSize === 'xlarge'
      ? 'text-lg sm:text-xl leading-relaxed'
      : solutionFontSize === 'large'
      ? 'text-base sm:text-lg leading-relaxed'
      : 'text-sm sm:text-base leading-relaxed';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-30">
        <div className="w-[90%] mx-auto px-2 sm:px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="Back to Exam Home"
              >
                <Home className="w-4 h-4" />
              </button>
            )}

            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center font-bold text-white shadow">
              SSC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xs sm:text-sm font-bold tracking-tight">
                  Performance Analysis &amp; Solutions
                </h1>
                {attemptsHistory.length > 0 && (
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-semibold">
                    Attempt #{attemptsHistory[currentAttemptIndex]?.attemptNumber || currentAttemptIndex + 1}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {examTitle || 'SSC CGL 2026 Trend-Based Mock 01'} • Performance Review
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Scorecard</span>
            </button>

            {/* Re-attempt Dropdown Trigger */}
            <div className="relative">
              <div className="flex items-center rounded-lg bg-blue-600 shadow">
                <button
                  onClick={() => onReattemptExam('full')}
                  className="px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-500 rounded-l-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-attempt Mock</span>
                </button>
                <button
                  onClick={() => setShowReattemptMenu(!showReattemptMenu)}
                  className="px-2 py-1.5 text-xs font-bold text-white hover:bg-blue-500 border-l border-blue-500 rounded-r-lg cursor-pointer"
                  title="More Re-attempt Options"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Dropdown Menu */}
              {showReattemptMenu && (
                <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-slate-800 text-xs animate-in fade-in">
                  <button
                    onClick={() => {
                      setShowReattemptMenu(false);
                      onReattemptExam('full');
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Re-attempt Full Mock</div>
                      <div className="text-[11px] text-slate-500">Fresh clean slate with all 100 questions</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowReattemptMenu(false);
                      onReattemptExam('incorrect_and_skipped');
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 border-t border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-blue-700">Re-attempt Mistakes &amp; Skipped</div>
                      <div className="text-[11px] text-slate-500">Focus on the {analysisData.totalIncorrect + analysisData.totalUnattempted} unmastered questions</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Attempt History Switcher Tabs (If multiple attempts exist) */}
        {attemptsHistory.length > 1 && (
          <div className="bg-slate-800/95 border-t border-slate-700/80 px-2 sm:px-4">
            <div className="w-[90%] mx-auto flex items-center gap-2 py-1.5 overflow-x-auto no-scrollbar">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mr-1 shrink-0">
                Attempt History:
              </span>
              {attemptsHistory.map((att, idx) => {
                const isSelected = idx === currentAttemptIndex;
                return (
                  <button
                    key={att.id}
                    onClick={() => onSelectAttempt?.(idx)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition shrink-0 flex items-center gap-2 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs font-bold'
                        : 'bg-slate-700/70 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <span>Attempt #{att.attemptNumber}</span>
                    <span className="text-[11px] font-mono text-emerald-300">
                      {att.score.toFixed(1)}m
                    </span>
                    <span className="text-[10px] opacity-75">({att.accuracy.toFixed(0)}%)</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      <main className="w-[90%] mx-auto py-6 space-y-6">
        {/* 1. Primary Scoreboard Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:p-7">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Left Score Block */}
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-widest text-blue-300 flex items-center gap-2">
                  <span>Total Normalized Raw Score</span>
                  {attemptsHistory.length > 1 && currentAttemptIndex > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-0.5">
                      <ArrowUpRight className="w-3 h-3" />
                      Improved vs Attempt #1
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
                    {analysisData.netScore.toFixed(2)}
                  </span>
                  <span className="text-slate-400 text-lg sm:text-xl font-normal">/ 200.00</span>
                </div>
                <p className="text-xs text-slate-300">
                  Total Correct Marks: <strong className="text-emerald-400">+{analysisData.totalCorrect * 2}</strong> •
                  Negative Penalty: <strong className="text-rose-400">−{analysisData.totalNegativePenalty.toFixed(2)}</strong>
                </p>
              </div>

              {/* Right Quick Metrics Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
                <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Accuracy</div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono mt-0.5">
                    {analysisData.accuracy.toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {analysisData.totalCorrect}/{analysisData.attemptedCount} Att
                  </div>
                </div>

                <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Attempted</div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-300 font-mono mt-0.5">
                    {analysisData.attemptedCount}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">/ 100 Questions</div>
                </div>

                <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Est. Percentile</div>
                  <div className="text-xl sm:text-2xl font-bold text-amber-300 font-mono mt-0.5">
                    {analysisData.predictedPercentile.toFixed(1)}%ile
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Among Aspirants</div>
                </div>

                <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Time Used</div>
                  <div className="text-xl sm:text-2xl font-bold text-sky-300 font-mono mt-0.5">
                    {formatTime(totalTimeSpentSeconds)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">/ 60m Allotted</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sectional Performance Matrix */}
          <div className="p-5 sm:p-6 bg-white border-t border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3.5">
              Sectional Breakdown vs. 2026 Trend Targets
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {EXAM_SECTIONS.map((sec) => {
                const data = analysisData.sectionMetrics[sec.id];
                const secAccuracy = data.correct + data.incorrect > 0
                  ? (data.correct / (data.correct + data.incorrect)) * 100
                  : 0;

                return (
                  <div
                    key={sec.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-800">{sec.shortName}</span>
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {data.score.toFixed(2)} / 50
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Target:</span>
                        <span className="font-semibold text-amber-700">{sec.target}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Correct / Att:</span>
                        <span className="font-semibold text-emerald-700">
                          {data.correct} / {data.correct + data.incorrect}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Accuracy:</span>
                        <span className="font-semibold">{secAccuracy.toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Time Spent:</span>
                        <span className="font-mono text-slate-700">{formatTime(data.timeSpent)}</span>
                      </div>
                    </div>

                    {/* Mini Accuracy Progress Bar */}
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, secAccuracy)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Detailed Solutions & Question Analysis Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-5">
          {/* Solution Header with Reading Ergonomics */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Detailed Solutions &amp; Step-by-Step Explanations
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review mistakes, master shortcuts, and bookmark questions for revision.
              </p>
            </div>

            {/* Reading Controls Toolbar: Language, Font Size, Expand/Collapse */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Language Switch */}
              <div className="flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-300 text-xs">
                <button
                  onClick={() => setSolutionLang('en')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition ${
                    solutionLang === 'en' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setSolutionLang('hi')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition ${
                    solutionLang === 'hi' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  हिन्दी
                </button>
              </div>

              {/* Font Size */}
              <div className="flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-300 text-xs">
                <span className="px-1 text-slate-400">
                  <Type className="w-3.5 h-3.5" />
                </span>
                <button
                  onClick={() => setSolutionFontSize('normal')}
                  className={`px-2 py-0.5 rounded font-bold text-xs ${
                    solutionFontSize === 'normal' ? 'bg-slate-700 text-white' : 'text-slate-600'
                  }`}
                  title="Normal Text"
                >
                  A
                </button>
                <button
                  onClick={() => setSolutionFontSize('large')}
                  className={`px-2 py-0.5 rounded font-bold text-sm ${
                    solutionFontSize === 'large' ? 'bg-slate-700 text-white' : 'text-slate-600'
                  }`}
                  title="Large Text"
                >
                  A+
                </button>
                <button
                  onClick={() => setSolutionFontSize('xlarge')}
                  className={`px-2 py-0.5 rounded font-extrabold text-base ${
                    solutionFontSize === 'xlarge' ? 'bg-slate-700 text-white' : 'text-slate-600'
                  }`}
                  title="Extra Large Text"
                >
                  A++
                </button>
              </div>

              {/* Expand / Collapse All Solutions */}
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={expandAll}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
                >
                  Collapse
                </button>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search questions, topics, formulas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
                  statusFilter === 'all'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All (100)
              </button>
              <button
                onClick={() => setStatusFilter('incorrect')}
                className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
                  statusFilter === 'incorrect'
                    ? 'bg-rose-600 text-white font-semibold'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                Wrong ({analysisData.totalIncorrect})
              </button>
              <button
                onClick={() => setStatusFilter('unattempted')}
                className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
                  statusFilter === 'unattempted'
                    ? 'bg-slate-700 text-white font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Skipped ({analysisData.totalUnattempted})
              </button>
              <button
                onClick={() => setStatusFilter('correct')}
                className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
                  statusFilter === 'correct'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Correct ({analysisData.totalCorrect})
              </button>
              <button
                onClick={() => setStatusFilter('marked')}
                className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
                  statusFilter === 'marked'
                    ? 'bg-amber-600 text-white font-semibold'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                Bookmarked
              </button>
            </div>
          </div>

          {/* Section Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
            <button
              onClick={() => setSelectedSection('all')}
              className={`px-3 py-1 rounded-full font-medium transition ${
                selectedSection === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Sections
            </button>
            {EXAM_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSection(sec.id)}
                className={`px-3 py-1 rounded-full font-medium transition whitespace-nowrap ${
                  selectedSection === sec.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sec.name}
              </button>
            ))}
          </div>

          {/* Questions List */}
          <div className="space-y-4 pt-2">
            {filteredQuestions.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                No questions match your filter criteria.
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const resp = responses[q.id];
                const userChoice = resp?.selectedOption;
                const isAttempted =
                  userChoice !== null &&
                  userChoice !== undefined &&
                  (resp?.status === 'answered' || resp?.status === 'answered_and_marked');

                const isCorrect = isAttempted && userChoice === q.correctOption;
                const isWrong = isAttempted && userChoice !== q.correctOption;
                const isSkipped = !isAttempted;
                const isExpanded = Boolean(expandedExplanations[q.id]);
                const isStarred = Boolean(starredQuestions[q.id]);

                const localizedPrompt = getLocalizedQuestion(q.id, q.text, q.sectionId, solutionLang);

                return (
                  <div
                    key={q.id}
                    className={`rounded-xl border transition overflow-hidden ${
                      isCorrect
                        ? 'border-emerald-200 bg-emerald-50/10'
                        : isWrong
                        ? 'border-rose-200 bg-rose-50/10'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    {/* Question Card Header */}
                    <div className="bg-slate-50/90 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900">
                          Q.{q.questionNumber}
                        </span>
                        <span className="text-slate-400">|</span>
                        <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                          {q.subject || q.sectionName}
                        </span>
                        <span className="bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                          {q.topic}
                        </span>
                        {q.subtopic && (
                          <span className="bg-purple-50 text-purple-700 font-medium px-2 py-0.5 rounded border border-purple-200 text-[11px]">
                            {q.subtopic}
                          </span>
                        )}
                        {q.difficulty && (
                          <span
                            className={`px-2 py-0.5 rounded font-medium text-[10px] ${
                              q.difficulty === 'Easy'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : q.difficulty === 'Hard'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {q.difficulty}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Status Tag */}
                        {isCorrect && (
                          <span className="text-emerald-700 flex items-center gap-1 bg-emerald-100/90 font-semibold px-2 py-0.5 rounded-full text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+2.00)
                          </span>
                        )}
                        {isWrong && (
                          <span className="text-rose-700 flex items-center gap-1 bg-rose-100/90 font-semibold px-2 py-0.5 rounded-full text-[11px]">
                            <XCircle className="w-3.5 h-3.5" /> Wrong (−0.50)
                          </span>
                        )}
                        {isSkipped && (
                          <span className="text-slate-600 flex items-center gap-1 bg-slate-200 font-medium px-2 py-0.5 rounded-full text-[11px]">
                            <AlertCircle className="w-3.5 h-3.5" /> Skipped (0.00)
                          </span>
                        )}

                        {/* Bookmark Button */}
                        <button
                          onClick={() => toggleStar(q.id)}
                          className={`p-1 rounded-lg transition ${
                            isStarred
                              ? 'text-amber-500 bg-amber-50 border border-amber-300'
                              : 'text-slate-400 hover:text-slate-600 border border-transparent'
                          }`}
                          title="Bookmark for revision"
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="p-4 sm:p-5 space-y-4">
                      {q.passage && (
                        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
                          <strong className="block text-amber-900 font-sans font-semibold mb-1 uppercase tracking-wide text-[10px]">
                            Reading Comprehension / Cloze Test Reference Passage:
                          </strong>
                          {q.passage}
                        </div>
                      )}

                      <div className={`text-slate-900 font-normal leading-relaxed whitespace-pre-line ${fontSizeClass}`}>
                        {localizedPrompt.text}
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm pt-1">
                        {q.options.map((opt) => {
                          const isTheCorrectOne = opt.id === q.correctOption;
                          const isUserSelected = userChoice === opt.id;
                          const localizedOptText = getLocalizedOption(
                            q.id,
                            opt.id,
                            opt.text,
                            q.sectionId,
                            solutionLang
                          );

                          let badgeClass = 'bg-slate-50 border-slate-200 text-slate-800';

                          if (isTheCorrectOne) {
                            badgeClass =
                              'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold ring-1 ring-emerald-300';
                          } else if (isUserSelected && !isTheCorrectOne) {
                            badgeClass =
                              'bg-rose-50 border-rose-400 text-rose-950 line-through opacity-90';
                          }

                          return (
                            <div
                              key={opt.id}
                              className={`p-3 rounded-lg border flex items-start gap-2.5 transition ${badgeClass}`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                  isTheCorrectOne
                                    ? 'bg-emerald-600 text-white'
                                    : isUserSelected
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {opt.id}
                              </span>

                              <div className="flex-1 min-w-0">
                                <span className="leading-snug">{localizedOptText}</span>
                                {isTheCorrectOne && (
                                  <span className="block text-[11px] text-emerald-700 font-bold mt-0.5">
                                    ✓ Correct Answer
                                  </span>
                                )}
                                {isUserSelected && !isTheCorrectOne && (
                                  <span className="block text-[11px] text-rose-700 font-bold mt-0.5">
                                    ✗ Your Marked Answer
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Detailed Solution Accordion */}
                      <div className="pt-2 border-t border-slate-200">
                        <button
                          onClick={() => toggleExplanation(q.id)}
                          className="w-full flex items-center justify-between text-xs font-bold text-blue-700 hover:text-blue-900 py-1 cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                            {isExpanded ? 'Hide Step-by-Step Solution' : 'View Step-by-Step Solution & Concept'}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="mt-2.5 p-4 bg-blue-50/60 rounded-xl border border-blue-200 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-1.5 whitespace-pre-line animate-in fade-in">
                            <div className="font-bold text-blue-950 text-xs flex items-center gap-1">
                              <span>Solution &amp; Core Methodology:</span>
                            </div>
                            <p className="text-slate-700">
                              {q.explanation && q.explanation.trim()
                                ? q.explanation
                                : 'Explanation not provided.'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
