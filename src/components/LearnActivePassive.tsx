import React, { useState, useMemo } from 'react';
import { ACTIVE_PASSIVE_THEORY, ActivePassiveQuestion } from '../data/activePassiveData';
import { ALL_ACTIVE_PASSIVE_QUESTIONS, convertToCBTQuestions } from '../data/activePassiveQuestions';
import { Question } from '../types';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  Filter,
  Search,
  Bookmark,
  RotateCcw,
  Play,
  Lightbulb,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Table,
  Check,
  Star,
  GraduationCap,
} from 'lucide-react';

interface LearnActivePassiveProps {
  onStartCustomExam: (
    questions: Question[],
    durationMinutes: number,
    examTitle: string,
    strictSectionalTimer: boolean
  ) => void;
  onBackToHome?: () => void;
}

export const LearnActivePassive: React.FC<LearnActivePassiveProps> = ({
  onStartCustomExam,
  onBackToHome,
}) => {
  const [activeTab, setActiveTab] = useState<'concepts' | 'tenses' | 'special' | 'traps' | 'practice'>('concepts');
  const [practiceMode, setPracticeMode] = useState<'quiz' | 'study'>('quiz');
  const [selectedShift, setSelectedShift] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'active_to_passive' | 'passive_to_active' | 'challenging'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Interactive quiz state
  const [userAnswers, setUserAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [bookmarkedQs, setBookmarkedQs] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('ssc_learn_bookmarked_active_passive');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleBookmark = (qNum: number) => {
    setBookmarkedQs(prev => {
      const updated = { ...prev, [qNum]: !prev[qNum] };
      try {
        localStorage.setItem('ssc_learn_bookmarked_active_passive', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleSelectAnswer = (qNum: number, optionId: 'A' | 'B' | 'C' | 'D') => {
    setUserAnswers(prev => ({ ...prev, [qNum]: optionId }));
    setShowExplanation(prev => ({ ...prev, [qNum]: true }));
  };

  const toggleExplanation = (qNum: number) => {
    setShowExplanation(prev => ({ ...prev, [qNum]: !prev[qNum] }));
  };

  // Filtered practice questions
  const filteredQuestions = useMemo(() => {
    return ALL_ACTIVE_PASSIVE_QUESTIONS.filter(q => {
      // Shift filter
      if (selectedShift !== 'all' && !q.source.includes(selectedShift)) {
        return false;
      }
      // Type filter
      if (selectedType === 'active_to_passive') {
        const isAtoP = q.questionText.toLowerCase().includes('passive') || q.questionText.toLowerCase().includes('from active to passive');
        if (!isAtoP) return false;
      } else if (selectedType === 'passive_to_active') {
        const isPtoA = q.questionText.toLowerCase().includes('active');
        if (!isPtoA) return false;
      } else if (selectedType === 'challenging') {
        if (!q.tags.includes('Challenging') && !q.tags.includes('SSC Special')) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const qText = q.questionText.toLowerCase();
        const qRule = q.structureRule.toLowerCase();
        const qExpl = q.mainExplanation.toLowerCase();
        const term = searchQuery.toLowerCase();
        return qText.includes(term) || qRule.includes(term) || qExpl.includes(term) || q.qNum.toString() === term;
      }

      return true;
    });
  }, [selectedShift, selectedType, searchQuery]);

  // Quiz score stats
  const quizStats = useMemo(() => {
    const answeredCount = Object.keys(userAnswers).length;
    let correctCount = 0;
    ALL_ACTIVE_PASSIVE_QUESTIONS.forEach(q => {
      if (userAnswers[q.qNum] === q.correctOption) {
        correctCount++;
      }
    });
    return {
      answered: answeredCount,
      correct: correctCount,
      incorrect: answeredCount - correctCount,
      total: ALL_ACTIVE_PASSIVE_QUESTIONS.length,
      accuracy: answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0,
    };
  }, [userAnswers]);

  const handleLaunchInCBT = () => {
    const cbtQs = convertToCBTQuestions(filteredQuestions.length > 0 ? filteredQuestions : ALL_ACTIVE_PASSIVE_QUESTIONS);
    const duration = Math.max(10, Math.ceil((cbtQs.length * 45) / 60)); // 45s per Q
    onStartCustomExam(
      cbtQs,
      duration,
      `SSC Steno 2026: Active & Passive Voice Practice (${cbtQs.length} Qs)`,
      false
    );
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setShowExplanation({});
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-6 sm:py-8 px-2 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-700/60 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 mb-2">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>LEARN MODULE</span>
                <span>•</span>
                <span>TOPIC 1: ACTIVE &amp; PASSIVE VOICE</span>
                <span>•</span>
                <span className="text-emerald-400">SSC STENO 2026 RECENT PAPERS</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Active &amp; Passive Voice: 6 Golden Steps &amp; 104 Questions
              </h1>
              
              <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-3xl leading-relaxed">
                Master the 30-Second Parallel Scan Method, complete tense transition rules, causative <code className="text-amber-300">make to</code> constructions, and all actual questions from SSC Steno 2026 shifts with detailed option elimination notes.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={handleLaunchInCBT}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Take as CBT Test ({filteredQuestions.length} Qs)</span>
              </button>

              {onBackToHome && (
                <button
                  onClick={onBackToHome}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold rounded-xl border border-slate-700 transition cursor-pointer"
                >
                  Exit to Dashboard
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="mt-5 pt-4 border-t border-blue-800/60 flex items-center justify-between text-xs text-blue-200 flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <span><strong>44</strong> Real SSC 2026 Questions</span>
              <span>•</span>
              <span><strong>6</strong> Golden Concept Steps</span>
              <span>•</span>
              <span><strong>7</strong> High-Frequency Traps</span>
            </div>

            {quizStats.answered > 0 && (
              <div className="flex items-center gap-3 bg-blue-950/80 px-3 py-1 rounded-lg border border-blue-700/50">
                <span className="text-emerald-300 font-bold">Score: {quizStats.correct}/{quizStats.answered}</span>
                <span className="text-slate-400">({quizStats.accuracy}% Accuracy)</span>
                <button
                  onClick={handleResetQuiz}
                  className="text-xs text-amber-300 hover:underline flex items-center gap-1 cursor-pointer ml-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-800 border border-slate-700 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('concepts')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'concepts'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. 6 Golden Steps</span>
          </button>

          <button
            onClick={() => setActiveTab('tenses')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'tenses'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>2. Tense Chart</span>
          </button>

          <button
            onClick={() => setActiveTab('special')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'special'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>3. Special Rules &amp; Causatives</span>
          </button>

          <button
            onClick={() => setActiveTab('traps')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'traps'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>4. 30-Sec Method &amp; Traps</span>
          </button>

          <button
            onClick={() => setActiveTab('practice')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'practice'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Target className="w-4 h-4 text-emerald-300" />
            <span>5. Practice All 44 Questions ({filteredQuestions.length})</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: 6 GOLDEN STEPS
            ========================================================================= */}
        {activeTab === 'concepts' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACTIVE_PASSIVE_THEORY.goldenSteps.map(step => (
                <div
                  key={step.step}
                  className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition shadow-sm space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/50 text-blue-300 font-extrabold flex items-center justify-center text-sm">
                      {step.step}
                    </span>
                    <h3 className="font-bold text-white text-base">{step.title}</h3>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {step.desc}
                  </p>

                  {step.example && (
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs text-amber-200 font-mono">
                      <strong>Ex:</strong> {step.example}
                    </div>
                  )}

                  {step.table && (
                    <div className="grid grid-cols-3 gap-1.5 pt-1 text-xs">
                      {step.table.map((item, idx) => (
                        <div key={idx} className="bg-slate-900/60 p-1.5 rounded border border-slate-700 text-center">
                          <span className="text-blue-300 font-bold">{item.active}</span>
                          <span className="text-slate-500 mx-1">→</span>
                          <span className="text-emerald-300 font-semibold">{item.passive}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Master Formula Card */}
            <div className="bg-gradient-to-r from-slate-800 to-indigo-950/70 border border-indigo-600/40 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>The Core Master Formula</span>
              </div>
              <div className="p-3.5 bg-slate-950/80 border border-indigo-500/40 rounded-lg text-sm sm:text-base font-mono text-center text-emerald-300">
                Object + [Tense Helping Verb] + <span className="text-amber-400 font-bold">V3 (Past Participle)</span> + by + Subject (Agent)
              </div>
              <p className="text-xs text-slate-300">
                <strong>Passive to Active Reverse Rule:</strong> Remove the auxiliary <code className="text-amber-300">be</code> form, make the <code className="text-blue-300">by</code>-agent the subject, and restore the main verb to the active tense form.
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: TENSE & HELPING VERB CHART
            ========================================================================= */}
        {activeTab === 'tenses' && (
          <div className="space-y-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base">
                    Master Tense Transition Chart ("सिर्फ Helping Verb देखो!")
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Remember: Continuous = <code>being</code> | Perfect = <code>been</code> | Future/Modal = <code>be</code>
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-900/90 text-slate-300 border-b border-slate-700">
                    <tr>
                      <th className="p-3 font-semibold">Tense Name</th>
                      <th className="p-3 font-semibold text-blue-300">Active Form</th>
                      <th className="p-3 font-semibold text-emerald-300">Passive Form</th>
                      <th className="p-3 font-semibold text-amber-300">Gopal Sir's Quick Trick</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {ACTIVE_PASSIVE_THEORY.tenseChart.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-750 transition">
                        <td className="p-3 font-medium text-white whitespace-nowrap">{row.tense}</td>
                        <td className="p-3 font-mono text-blue-300">{row.active}</td>
                        <td className="p-3 font-mono text-emerald-300 font-bold">{row.passive}</td>
                        <td className="p-3 text-amber-200 text-xs font-semibold">{row.trick}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: SPECIAL RULES & CAUSATIVES
            ========================================================================= */}
        {activeTab === 'special' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ACTIVE_PASSIVE_THEORY.specialRules.map((rule, idx) => (
              <div
                key={idx}
                className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3 hover:border-indigo-500/40 transition"
              >
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>{rule.category}</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">{rule.summary}</p>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-300">
                  {rule.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold mt-0.5">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* =========================================================================
            TAB 4: 30-SEC PARALLEL SCAN & TRAPS
            ========================================================================= */}
        {activeTab === 'traps' && (
          <div className="space-y-6">
            {/* 30-Sec Method */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base sm:text-lg">
                  The 30-Second Parallel Scan Method (Exams Shortcut)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ACTIVE_PASSIVE_THEORY.solvingTechnique.steps.map((st, sIdx) => (
                  <div key={sIdx} className="p-3.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-amber-300 block mb-1">Step {sIdx + 1}:</span>
                    {st}
                  </div>
                ))}
              </div>
            </div>

            {/* Traps Checklist */}
            <div className="bg-gradient-to-br from-red-950/40 via-slate-800 to-slate-900 border border-red-700/40 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-red-300">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Top 7 SSC Traps Identified in Recent 2026 Papers
                </h3>
              </div>

              <div className="space-y-2">
                {ACTIVE_PASSIVE_THEORY.solvingTechnique.commonTraps.map((trap, tIdx) => (
                  <div key={tIdx} className="flex items-start gap-2.5 p-2 rounded bg-slate-900/60 text-xs text-slate-300 border border-slate-800">
                    <span className="text-red-400 font-bold mt-0.5">✕</span>
                    <span>{trap}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: PRACTICE ALL 44 QUESTIONS WITH SOLUTIONS
            ========================================================================= */}
        {activeTab === 'practice' && (
          <div className="space-y-5">
            {/* Filters Bar */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search question text, rules, or keywords (e.g., architect, binoculars, car)..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Mode Selector */}
                <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-700 rounded-lg self-end sm:self-auto">
                  <button
                    onClick={() => setPracticeMode('quiz')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                      practiceMode === 'quiz'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Quiz Mode (Test Yourself)
                  </button>
                  <button
                    onClick={() => setPracticeMode('study')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                      practiceMode === 'study'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Study Mode (All Answers Shown)
                  </button>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-slate-700/60 text-xs">
                {/* Type Filters */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-400 text-[11px] font-semibold">Filter:</span>
                  {[
                    { id: 'all', label: 'All Questions' },
                    { id: 'active_to_passive', label: 'Active → Passive' },
                    { id: 'passive_to_active', label: 'Passive → Active' },
                    { id: 'challenging', label: 'Challenging Traps' },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedType(f.id as any)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                        selectedType === f.id
                          ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                          : 'bg-slate-900/60 text-slate-400 border border-slate-700/60 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Shift Filters */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-400 text-[11px] font-semibold">Shift:</span>
                  {[
                    { id: 'all', label: 'All Shifts' },
                    { id: '09 Sep', label: '09 Sep' },
                    { id: '10 Sep', label: '10 Sep' },
                    { id: '11 Sep', label: '11 Sep' },
                    { id: '12 Sep', label: '12 Sep' },
                    { id: '15 Sep', label: '15 Sep' },
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedShift(s.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                        selectedShift === s.id
                          ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                          : 'bg-slate-900/60 text-slate-400 border border-slate-700/60 hover:text-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700 text-slate-400">
                  <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                  <p className="text-sm">No questions match the selected filters or search query.</p>
                </div>
              ) : (
                filteredQuestions.map((q, idx) => {
                  const userAnswer = userAnswers[q.qNum];
                  const isAnswered = userAnswer !== undefined;
                  const isCorrect = userAnswer === q.correctOption;
                  const isRevealed = practiceMode === 'study' || showExplanation[q.qNum] || isAnswered;
                  const isBookmarked = Boolean(bookmarkedQs[q.qNum]);

                  return (
                    <div
                      key={q.qNum}
                      className={`bg-slate-800 border rounded-xl p-5 space-y-4 transition ${
                        isAnswered
                          ? isCorrect
                            ? 'border-emerald-600/60 bg-emerald-950/10'
                            : 'border-red-600/60 bg-red-950/10'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {/* Question Top Bar */}
                      <div className="flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-blue-400 text-sm">Q{q.qNum}.</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-300 font-semibold">{q.source}</span>
                          {q.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleBookmark(q.qNum)}
                            className={`p-1.5 rounded hover:bg-slate-700 transition cursor-pointer ${
                              isBookmarked ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                            }`}
                            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                          >
                            <Star className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Question Text */}
                      <div className="text-sm sm:text-base font-medium text-slate-100 whitespace-pre-line leading-relaxed">
                        {q.questionText}
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 gap-2">
                        {q.options.map(opt => {
                          const isThisOptionSelected = userAnswer === opt.id;
                          const isThisOptionCorrect = opt.id === q.correctOption;

                          let btnStyle = 'bg-slate-900/80 border-slate-700/80 hover:bg-slate-700/50 text-slate-200';
                          if (isRevealed) {
                            if (isThisOptionCorrect) {
                              btnStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold';
                            } else if (isThisOptionSelected && !isThisOptionCorrect) {
                              btnStyle = 'bg-red-950/70 border-red-500 text-red-200 line-through';
                            } else {
                              btnStyle = 'bg-slate-900/50 border-slate-800 text-slate-400 opacity-60';
                            }
                          }

                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleSelectAnswer(q.qNum, opt.id)}
                              disabled={isRevealed && practiceMode === 'study'}
                              className={`p-3 rounded-lg border text-left text-xs sm:text-sm transition flex items-start gap-3 cursor-pointer ${btnStyle}`}
                            >
                              <span className="font-bold uppercase px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs">
                                ({opt.id.toLowerCase()})
                              </span>
                              <span className="flex-1 leading-relaxed">{opt.text}</span>
                              {isRevealed && isThisOptionCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              )}
                              {isRevealed && isThisOptionSelected && !isThisOptionCorrect && (
                                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Toggle Solution Button for Quiz Mode */}
                      {practiceMode === 'quiz' && !isAnswered && (
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => toggleExplanation(q.qNum)}
                            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <span>{showExplanation[q.qNum] ? 'Hide Solution' : 'Show Solution & Answer'}</span>
                            {showExplanation[q.qNum] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}

                      {/* Detailed Solution & Option Breakdown Card */}
                      {isRevealed && (
                        <div className="mt-3 p-4 rounded-xl bg-slate-900/90 border border-blue-900/60 space-y-3 text-xs sm:text-sm">
                          {/* Structure & Rule */}
                          <div className="flex items-center gap-2 text-xs text-blue-300 font-bold uppercase tracking-wider">
                            <Lightbulb className="w-4 h-4 text-amber-400" />
                            <span>Correct Answer: ({q.correctOption.toLowerCase()})</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-300 font-mono text-[11px]">{q.structureRule}</span>
                          </div>

                          <div className="text-slate-200 leading-relaxed font-normal">
                            {q.mainExplanation}
                          </div>

                          {q.notes && (
                            <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200">
                              <strong>Key Note:</strong> {q.notes}
                            </div>
                          )}

                          {/* Detailed Elimination Breakdown */}
                          <div className="pt-2 border-t border-slate-800 space-y-1.5">
                            <span className="text-slate-400 text-xs font-bold block mb-1">
                              Option-by-Option Elimination Analysis:
                            </span>
                            {q.eliminations.map(e => (
                              <div
                                key={e.opt}
                                className={`text-xs flex items-start gap-2 p-1.5 rounded ${
                                  e.opt === q.correctOption
                                    ? 'bg-emerald-950/40 text-emerald-200'
                                    : 'text-slate-400'
                                }`}
                              >
                                <span className="font-bold">({e.opt.toLowerCase()}):</span>
                                <span className="leading-relaxed">{e.reason}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
