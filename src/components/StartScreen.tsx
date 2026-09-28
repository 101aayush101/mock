import React, { useState } from 'react';
import { EXAM_SECTIONS } from '../data/mockExamData';
import { AttemptRecord, Question, SectionId } from '../types';
import { CustomMockCreator } from './CustomMockCreator';
import { LearnActivePassive } from './LearnActivePassive';
import {
  Play,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  History,
  Trash2,
  ShieldCheck,
  TrendingUp,
  RotateCcw,
  Target,
  Sparkles,
  Layers,
  Brain,
  Globe,
  Calculator,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

interface StartScreenProps {
  onStartExam: (strictSectionalTimer: boolean, mode?: 'full' | 'incorrect_and_skipped') => void;
  onStartSectionalExam?: (sectionId: SectionId) => void;
  onStartCustomExam: (
    questions: Question[],
    durationMinutes: number,
    examTitle: string,
    strictSectionalTimer: boolean
  ) => void;
  onViewPastAttempt: (attemptIndex?: number) => void;
  attemptsHistory: AttemptRecord[];
  onClearHistory: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartExam,
  onStartSectionalExam,
  onStartCustomExam,
  onViewPastAttempt,
  attemptsHistory,
  onClearHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'full' | 'sectional' | 'custom' | 'learn'>('full');
  const [customInitialMode, setCustomInitialMode] = useState<'full' | 'sectional'>('sectional');
  const [customInitialSection, setCustomInitialSection] = useState<SectionId>('reasoning');

  const [strictSectionalTimer, setStrictSectionalTimer] = useState<boolean>(false);
  const [hasAgreed, setHasAgreed] = useState<boolean>(true);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  const latestAttempt = attemptsHistory[attemptsHistory.length - 1];

  const SECTION_TOPICS: Record<SectionId, string> = {
    reasoning: 'Analogies, Syllogisms, Number/Alphabet Series, Blood Relations, Coding-Decoding & Direction Sense',
    general_awareness: 'Indian Polity, Modern History, Current Affairs, General Science & Indian Economy',
    quant: 'Arithmetic, Percentages, Ratio, Profit & Loss, Algebra, Geometry, Trigonometry & DI',
    english: 'Cloze Test, Spotting Errors, Sentence Improvement, Idioms & Phrases, Vocab & Synonyms',
  };

  const handleOpenCustomForSection = (secId: SectionId) => {
    setCustomInitialMode('sectional');
    setCustomInitialSection(secId);
    setActiveTab('custom');
  };

  const handleOpenCustomForFullMock = () => {
    setCustomInitialMode('full');
    setActiveTab('custom');
  };

  const getSectionIcon = (secId: SectionId) => {
    switch (secId) {
      case 'reasoning':
        return <Brain className="w-5 h-5 text-purple-400" />;
      case 'general_awareness':
        return <Globe className="w-5 h-5 text-emerald-400" />;
      case 'quant':
        return <Calculator className="w-5 h-5 text-amber-400" />;
      case 'english':
        return <BookOpen className="w-5 h-5 text-blue-400" />;
    }
  };

  const getSectionColorClass = (secId: SectionId) => {
    switch (secId) {
      case 'reasoning':
        return {
          border: 'border-purple-500/40 hover:border-purple-500',
          badge: 'bg-purple-900/60 text-purple-200 border-purple-700',
          button: 'bg-purple-600 hover:bg-purple-500 text-white',
        };
      case 'general_awareness':
        return {
          border: 'border-emerald-500/40 hover:border-emerald-500',
          badge: 'bg-emerald-900/60 text-emerald-200 border-emerald-700',
          button: 'bg-emerald-600 hover:bg-emerald-500 text-white',
        };
      case 'quant':
        return {
          border: 'border-amber-500/40 hover:border-amber-500',
          badge: 'bg-amber-900/60 text-amber-200 border-amber-700',
          button: 'bg-amber-600 hover:bg-amber-500 text-white',
        };
      case 'english':
      default:
        return {
          border: 'border-blue-500/40 hover:border-blue-500',
          badge: 'bg-blue-900/60 text-blue-200 border-blue-700',
          button: 'bg-blue-600 hover:bg-blue-500 text-white',
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-8 sm:py-12 px-2 sm:px-4">
      <div className="w-[90%] mx-auto max-w-5xl space-y-6">
        {/* Top Navigation Tabs: Full Mock, Sectional Mock, Custom Mock Creator, and Learn Module */}
        <div className="flex items-center justify-between gap-2 p-1.5 bg-slate-800/90 border border-slate-700/80 rounded-2xl flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setActiveTab('full')}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'full'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-blue-300" />
            <span>Full Mock (100 Qs)</span>
          </button>

          <button
            onClick={() => setActiveTab('sectional')}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'sectional'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-700/50'
            }`}
          >
            <Target className="w-4 h-4 text-emerald-300" />
            <span>Sectional (4 Subjects)</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-purple-300 hover:bg-slate-700/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>Paste Qs (Custom)</span>
          </button>

          <button
            onClick={() => setActiveTab('learn')}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'learn'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold shadow-md'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-700/50'
            }`}
          >
            <GraduationCap className={`w-4 h-4 ${activeTab === 'learn' ? 'text-slate-950' : 'text-amber-400'}`} />
            <span>Learn (Active-Passive)</span>
          </button>
        </div>

        {/* =========================================================================
            VIEW 0: LEARN MODULE (TOPIC 1: ACTIVE & PASSIVE VOICE)
            ========================================================================= */}
        {activeTab === 'learn' ? (
          <LearnActivePassive
            onStartCustomExam={onStartCustomExam}
            onBackToHome={() => setActiveTab('full')}
          />
        ) : activeTab === 'custom' ? (
          /* =========================================================================
             VIEW 1: CUSTOM MOCK CREATOR
             ========================================================================= */
          <CustomMockCreator
            onStartCustomExam={onStartCustomExam}
            onCancel={() => setActiveTab('full')}
            initialMockType={customInitialMode}
            initialSection={customInitialSection}
          />
        ) : activeTab === 'sectional' ? (
          /* =========================================================================
              VIEW 2: SECTIONAL MOCKS (4 SUBJECTS)
              ========================================================================= */
          <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden space-y-6">
            {/* Banner */}
            <div className="bg-gradient-to-r from-teal-700 via-emerald-800 to-slate-900 p-5 sm:p-8 text-white relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-xs font-semibold mb-3">
                <Target className="w-3.5 h-3.5" />
                <span>Subject-Specific Speed Tests • 15 Minutes • 25 Questions • 50 Marks</span>
              </div>

              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                SSC CGL 2026 — SECTIONAL MOCK TESTS
              </h1>

              <p className="mt-2 text-slate-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Choose any of the four core subjects to simulate rapid sectional pacing, accuracy
                drills, and pinpoint strengths and weaknesses.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-emerald-100">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-300" />
                  <span>15 Minutes Each</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>+2.00 / −0.50 Marking</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-300" />
                  <span>25 Questions per Section</span>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8 space-y-6">
              {/* Shortcut to Custom Creator */}
              <div className="bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/40 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs flex-wrap">
                <div className="flex items-center gap-2.5 text-purple-200">
                  <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs sm:text-sm">
                      Have your own questions from Telegram or books?
                    </div>
                    <div className="text-[11px] text-purple-300">
                      Copy &amp; paste questions to create a custom sectional test or full 4-subject mock test!
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleOpenCustomForFullMock}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1.5 text-xs ml-auto sm:ml-0"
                >
                  <span>Paste Custom Questions</span>
                  <span>→</span>
                </button>
              </div>

              {/* 4 Subject Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {EXAM_SECTIONS.map((sec) => {
                  const style = getSectionColorClass(sec.id);
                  return (
                    <div
                      key={sec.id}
                      className={`p-5 rounded-2xl bg-slate-900/80 border ${style.border} transition flex flex-col justify-between space-y-4`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                              {getSectionIcon(sec.id)}
                            </div>
                            <div>
                              <h3 className="font-bold text-sm text-white">{sec.name}</h3>
                              <span className="text-[11px] text-slate-400">
                                {sec.questionRange} • {sec.marks} Marks
                              </span>
                            </div>
                          </div>

                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border ${style.badge}`}
                          >
                            Target: {sec.target}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed pt-1">
                          {SECTION_TOPICS[sec.id]}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleOpenCustomForSection(sec.id)}
                            className="w-full sm:w-auto text-[11px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <span>Paste questions</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          {sec.id === 'english' && (
                            <button
                              onClick={() => setActiveTab('learn')}
                              className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30"
                            >
                              <GraduationCap className="w-3 h-3 text-amber-400" />
                              <span>Learn: Active-Passive Voice</span>
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            if (onStartSectionalExam) {
                              onStartSectionalExam(sec.id);
                            } else {
                              onStartExam(false, 'full');
                            }
                          }}
                          className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer ${style.button}`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Start {sec.shortName} Mock (15m)</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
              VIEW 3: FULL MOCK TEST (100 QUESTIONS)
              ========================================================================= */
          <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-5 sm:p-8 text-white relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/40 text-xs font-semibold mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Real CGL 2026 Tier-I CBT Simulation • Multi-Attempt Enabled</span>
              </div>

              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                SSC CGL 2026 — TREND-BASED MOCK 01
              </h1>

              <p className="mt-2 text-slate-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Authentic TCS Exam Interface • 100 Questions • 200 Marks • 60 Minutes • Negative Marking: −0.50 per wrong answer.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-blue-100">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-300" />
                  <span>60 Minutes Total</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>+2.00 / −0.50 Marking</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-emerald-300" />
                  <span>Unlimited Re-attempts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-300" />
                  <span>Do not pause between sections</span>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8 space-y-6">
              {/* Quick Shortcut Banner for Custom Mock Creator */}
              <div className="bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/40 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs flex-wrap">
                <div className="flex items-center gap-2.5 text-purple-200">
                  <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs sm:text-sm">
                      Want to practice your own questions?
                    </div>
                    <div className="text-[11px] text-purple-300">
                      Copy and paste questions to create an instant custom Full Mock or Sectional Mock!
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleOpenCustomForFullMock}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1.5 text-xs ml-auto sm:ml-0"
                >
                  <span>Paste Questions Now</span>
                  <span>→</span>
                </button>
              </div>

              {/* Previous Attempts History Banner if exists */}
              {attemptsHistory.length > 0 && (
                <div className="bg-slate-900/90 rounded-xl border border-blue-500/30 p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-blue-400" />
                      <span className="font-bold text-sm text-slate-200">
                        Previous Attempts History ({attemptsHistory.length})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewPastAttempt(attemptsHistory.length - 1)}
                        className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                      >
                        View Latest Analysis →
                      </button>
                      <button
                        onClick={() => setShowClearConfirm(true)}
                        className="p-1 text-slate-400 hover:text-rose-400 rounded transition cursor-pointer"
                        title="Clear attempt history"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {latestAttempt && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
                      <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                        <div className="text-slate-400 text-[11px]">Latest Score</div>
                        <div className="text-base font-bold text-blue-400 font-mono">
                          {latestAttempt.score.toFixed(2)}{' '}
                          <span className="text-xs text-slate-400 font-normal">/ 200</span>
                        </div>
                      </div>

                      <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                        <div className="text-slate-400 text-[11px]">Accuracy</div>
                        <div className="text-base font-bold text-emerald-400 font-mono">
                          {latestAttempt.accuracy.toFixed(1)}%
                        </div>
                      </div>

                      <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                        <div className="text-slate-400 text-[11px]">Questions Attempted</div>
                        <div className="text-base font-bold text-amber-400 font-mono">
                          {latestAttempt.attempted}{' '}
                          <span className="text-xs text-slate-400 font-normal">/ 100</span>
                        </div>
                      </div>

                      <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                        <div className="text-slate-400 text-[11px]">Time Spent</div>
                        <div className="text-base font-bold text-purple-400 font-mono">
                          {Math.floor(latestAttempt.timeSpentSeconds / 60)}m{' '}
                          {latestAttempt.timeSpentSeconds % 60}s
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => onStartExam(strictSectionalTimer, 'incorrect_and_skipped')}
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-950/40 hover:bg-amber-950/60 border border-amber-500/40 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-attempt Only Mistakes &amp; Skipped Questions</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Sections Breakdown Grid */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  Exam Pattern &amp; Sectional Breakdown
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {EXAM_SECTIONS.map((section) => (
                    <div
                      key={section.id}
                      className="bg-slate-900/60 border border-slate-700/80 rounded-xl p-3.5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{section.shortName}</span>
                        <span className="text-[10px] text-blue-400 font-semibold bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                          {section.questionRange}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-200">{section.name}</div>
                      <div className="text-[11px] text-slate-400 space-y-0.5">
                        <div>
                          Marks: <strong className="text-slate-300">{section.marks}</strong> (25 Qs)
                        </div>
                        <div>
                          Target: <strong className="text-emerald-400">{section.target}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strict Timing Option */}
              <div className="bg-slate-900/60 border border-slate-700/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-400" />
                    Timing Simulation Mode:
                  </h4>
                  <span className="text-[11px] text-slate-400">Total: 60 Minutes</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setStrictSectionalTimer(false)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition flex items-start gap-3 ${
                      !strictSectionalTimer
                        ? 'bg-blue-950/70 border-blue-500 text-white ring-1 ring-blue-500'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="timing"
                      checked={!strictSectionalTimer}
                      onChange={() => setStrictSectionalTimer(false)}
                      className="mt-1 cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-200">
                        Flexible 60-Minute CBT (Recommended)
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Full 60 minutes overall timer with free section navigation and 15-min target pacing cues.
                      </div>
                    </div>
                  </label>

                  <label
                    onClick={() => setStrictSectionalTimer(true)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition flex items-start gap-3 ${
                      strictSectionalTimer
                        ? 'bg-blue-950/70 border-blue-500 text-white ring-1 ring-blue-500'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="timing"
                      checked={strictSectionalTimer}
                      onChange={() => setStrictSectionalTimer(true)}
                      className="mt-1 cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-200">
                        Strict 15-Minute Sectional Timers
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Enforces exactly 15 minutes per section before auto-advancing to the next section.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Declaration Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="declaration"
                  type="checkbox"
                  checked={hasAgreed}
                  onChange={(e) => setHasAgreed(e.target.checked)}
                  className="mt-1 rounded text-blue-600 focus:ring-blue-500 bg-slate-800 border-slate-700 cursor-pointer"
                />
                <label
                  htmlFor="declaration"
                  className="text-xs text-slate-300 cursor-pointer select-none leading-relaxed"
                >
                  I have read and understood the instructions. I declare that I am prepared to attempt the 100 questions within the allotted 60 minutes without external assistance.
                </label>
              </div>

              {/* Start Button & Past Analysis Link */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-700">
                {attemptsHistory.length > 0 ? (
                  <button
                    onClick={() => onViewPastAttempt(attemptsHistory.length - 1)}
                    className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <History className="w-4 h-4 text-blue-400" />
                    <span>Review Past Attempt Analysis</span>
                  </button>
                ) : (
                  <div className="text-xs text-slate-400">
                    Ready to test your real Tier-I readiness.
                  </div>
                )}

                <button
                  disabled={!hasAgreed}
                  onClick={() => onStartExam(strictSectionalTimer, 'full')}
                  className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm text-white shadow-lg transition flex items-center justify-center gap-2 active:scale-95 ${
                    hasAgreed
                      ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40 cursor-pointer'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    {attemptsHistory.length > 0
                      ? `Start Re-attempt #${attemptsHistory.length + 1}`
                      : 'Start Mock Examination'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clear History Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-400" />
              Clear All Attempt History?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will remove your previous scores and attempt logs from this browser. You can always start fresh anytime.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearHistory();
                  setShowClearConfirm(false);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
