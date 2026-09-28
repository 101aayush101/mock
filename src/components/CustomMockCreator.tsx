import React, { useState, useMemo, useRef } from 'react';
import { Question, SectionId, SavedCustomMock } from '../types';
import {
  ParsedBankQuestion,
  parseRawTextToQuestionBank,
  bankQuestionsToExamQuestions,
  reclassifyBankQuestion,
  detectSubjectForBankQuestions,
} from '../utils/centralizedQuestionBank';
import { SSC_CLASSIFICATION_TAXONOMY } from '../utils/questionClassifier';
import {
  Sparkles,
  Play,
  RotateCcw,
  Check,
  FileText,
  Clock,
  Award,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Filter,
  Trash2,
  Copy,
  Edit3,
  X,
  Shuffle,
  ListOrdered,
  AlertTriangle,
  HelpCircle,
  Layers,
  Search,
  Bookmark,
  Save,
  FolderOpen,
  Download,
  Upload,
  Calendar,
} from 'lucide-react';

export const PROMPT_SAMPLE_QUESTIONS = `SUBJECT: REASONING
CHAPTER: ANALOGY
SUBTOPIC: LETTER ANALOGY

Q1. Select the option that is related to the third letter-cluster in the same way as the second letter-cluster is related to the first letter-cluster:
TRACK : UTDGP :: GLOBE : ?
A) HNWFI
B) HMRFI
C) HNVFH
D) HNVEH
Answer: A
Explanation: Pattern: +1, +2, +3, +4, +5. G(+1)=H, L(+2)=N, O(+3)=R, B(+4)=F, E(+5)=J. Correct mapped option is HNWFI.

SUBJECT: REASONING
CHAPTER: CLASSIFICATION
SUBTOPIC: NUMBER CLASSIFICATION

Q2. Three of the following four number-pairs are alike in a certain way and one is different. Find the odd one out:
A) 14 : 197
B) 16 : 257
C) 18 : 325
D) 12 : 145
Answer: C
Explanation: Pattern: n : n² + 1. 14² + 1 = 197; 16² + 1 = 257; 12² + 1 = 145. But 18² + 1 = 325.

SUBJECT: REASONING
CHAPTER: SYLLOGISM
SUBTOPIC: STATEMENT AND CONCLUSION

Q3. Statements:
All roses are red.
Some red are flowers.
Conclusions:
I. Some roses are flowers.
II. Some flowers are red.
A) Only conclusion II follows
B) Only conclusion I follows
C) Both follow
D) Neither follows
Answer: A
Explanation: 'Some red are flowers' converts directly to 'Some flowers are red' (Conclusion II is valid).

SUBJECT: REASONING
CHAPTER: BLOOD RELATION
SUBTOPIC: CODED BLOOD RELATION

Q4. If 'A + B' means 'A is the father of B', 'A - B' means 'A is the sister of B', and 'A × B' means 'A is the brother of B', which of the following means 'P is the aunt of Q'?
A) P - R + Q
B) P + R - Q
C) P × R + Q
D) P - R × Q
Answer: A
Explanation: P - R means P is the sister of R. R + Q means R is the father of Q. Sister of father is paternal aunt.

SUBJECT: REASONING
CHAPTER: MISSING NUMBER
SUBTOPIC: MATRIX PATTERN

Q5. Select the missing number from the given pattern:
6   8   48
9   7   63
12  ?   96
A) 7
B) 8
C) 9
D) 10
Answer: B
Explanation: First number × Second number = Third number. 12 × 8 = 96.`;

interface CustomMockCreatorProps {
  onStartCustomExam: (
    questions: Question[],
    durationMinutes: number,
    examTitle: string,
    strictSectionalTimer: boolean
  ) => void;
  onCancel?: () => void;
  initialMockType?: 'full' | 'sectional';
  initialSection?: SectionId;
}

export const CustomMockCreator: React.FC<CustomMockCreatorProps> = ({
  onStartCustomExam,
  onCancel,
  initialMockType = 'full',
}) => {
  // 1. Raw Text State
  const [rawPastedText, setRawPastedText] = useState<string>(PROMPT_SAMPLE_QUESTIONS);

  // 2. Centralized Question Bank State
  const [bankQuestions, setBankQuestions] = useState<ParsedBankQuestion[]>(() => {
    const parsed = parseRawTextToQuestionBank(PROMPT_SAMPLE_QUESTIONS);
    return parsed.questions;
  });

  // 3. Duplicate alerts list
  const [duplicatesList, setDuplicatesList] = useState<Array<{ qNum1: number; qNum2: number; preview: string }>>(() => {
    const parsed = parseRawTextToQuestionBank(PROMPT_SAMPLE_QUESTIONS);
    return parsed.duplicates;
  });

  // 4. Mode Selection: 'full' vs 'sectional'
  const [generationMode, setGenerationMode] = useState<'full' | 'sectional'>(initialMockType);

  // 5. Full Mock Controls
  const [fullMockTitle, setFullMockTitle] = useState<string>('SSC CGL Custom Full Mock Test');
  const [fullMockDurationMinutes, setFullMockDurationMinutes] = useState<number>(60);
  const [fullMockOrder, setFullMockOrder] = useState<'by_section' | 'original' | 'random'>('by_section');
  const [isStrictSectionalTimerActive, setIsStrictSectionalTimerActive] = useState<boolean>(true);

  // 6. Sectional / Subtopic Mock Controls (Subject → Chapter → Subtopic → Number of Questions)
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedChapter, setSelectedChapter] = useState<string>('All');
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<string>('20');
  const [customQuestionCount, setCustomQuestionCount] = useState<number>(20);
  const [sectionalOrder, setSectionalOrder] = useState<'random' | 'original'>('random');
  const [sectionalDurationMinutes, setSectionalDurationMinutes] = useState<number>(15);
  const [sectionalMockTitle, setSectionalMockTitle] = useState<string>('');

  // 7. UI Toggles
  const [showNeedsAttentionPanel, setShowNeedsAttentionPanel] = useState<boolean>(true);
  const [showBankBrowser, setShowBankBrowser] = useState<boolean>(false);
  const [bankSearchQuery, setBankSearchQuery] = useState<string>('');
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // 8. Edit Question Modal State
  const [editingQuestion, setEditingQuestion] = useState<ParsedBankQuestion | null>(null);

  // 9. Saved Custom Mocks State & Storage
  const STORAGE_KEY_SAVED_CUSTOM_MOCKS = 'ssc_cgl_saved_custom_mocks';
  const [savedMocks, setSavedMocks] = useState<SavedCustomMock[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SAVED_CUSTOM_MOCKS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [saveMockName, setSaveMockName] = useState<string>('');
  const [saveMockNotes, setSaveMockNotes] = useState<string>('');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [showSavedMocksDrawer, setShowSavedMocksDrawer] = useState<boolean>(false);
  const [savedMocksSearch, setSavedMocksSearch] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse Raw Text Button Handler
  const handleParseQuestions = () => {
    const result = parseRawTextToQuestionBank(rawPastedText);
    setBankQuestions(result.questions);
    setDuplicatesList(result.duplicates);
    setShowNeedsAttentionPanel(true);

    // Auto-calculate realistic default duration: 1 minute per question or standard 60 mins for 100 Qs
    const qCount = result.questions.length;
    if (qCount >= 75) {
      setFullMockDurationMinutes(60);
    } else {
      setFullMockDurationMinutes(Math.max(5, Math.ceil(qCount * 1.0)));
    }
  };

  // Load Preset Samples
  const handleLoadSample5 = () => {
    setRawPastedText(PROMPT_SAMPLE_QUESTIONS);
    const result = parseRawTextToQuestionBank(PROMPT_SAMPLE_QUESTIONS);
    setBankQuestions(result.questions);
    setDuplicatesList(result.duplicates);
    setFullMockDurationMinutes(10);
  };

  const handleClearText = () => {
    setRawPastedText('');
    setBankQuestions([]);
    setDuplicatesList([]);
  };

  // Metrics computation from the Centralized Bank
  const validQuestions = useMemo(() => bankQuestions.filter((q) => q.isValid), [bankQuestions]);
  const invalidQuestions = useMemo(() => bankQuestions.filter((q) => !q.isValid), [bankQuestions]);
  const totalDetected = bankQuestions.length;
  const validCount = validQuestions.length;
  const needsAttentionCount = invalidQuestions.length;

  // 4-Subject Breakdown calculation across all valid bank questions
  const subjectBreakdown = useMemo(() => {
    const counts = {
      Reasoning: 0,
      'General Awareness': 0,
      'Quantitative Aptitude': 0,
      English: 0,
      Other: 0,
    };
    validQuestions.forEach((q) => {
      if (q.subject === 'Reasoning') counts.Reasoning++;
      else if (q.subject === 'General Awareness') counts['General Awareness']++;
      else if (q.subject === 'Quantitative Aptitude') counts['Quantitative Aptitude']++;
      else if (q.subject === 'English') counts.English++;
      else counts.Other++;
    });
    return counts;
  }, [validQuestions]);

  const filteredSavedMocks = useMemo(() => {
    if (!savedMocksSearch.trim()) return savedMocks;
    const query = savedMocksSearch.toLowerCase();
    return savedMocks.filter(
      (m) =>
        m.title.toLowerCase().includes(query) ||
        (m.notes && m.notes.toLowerCase().includes(query))
    );
  }, [savedMocks, savedMocksSearch]);

  const saveMocksToStorage = (updated: SavedCustomMock[]) => {
    setSavedMocks(updated);
    try {
      localStorage.setItem(STORAGE_KEY_SAVED_CUSTOM_MOCKS, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save custom mocks to storage', err);
    }
  };

  // Open Save Modal (auto-parses if needed)
  const handleOpenSaveModal = () => {
    let currentValid = validCount;
    if (bankQuestions.length === 0 && rawPastedText.trim().length > 0) {
      const result = parseRawTextToQuestionBank(rawPastedText);
      setBankQuestions(result.questions);
      setDuplicatesList(result.duplicates);
      currentValid = result.questions.filter((q) => q.isValid).length;
    }

    const defaultTitle =
      generationMode === 'sectional' && sectionalMockTitle.trim()
        ? sectionalMockTitle.trim()
        : fullMockTitle.trim() || `SSC CGL Custom Mock (${currentValid} Qs)`;

    setSaveMockName(defaultTitle);
    setSaveMockNotes('');
    setIsSaveModalOpen(true);
  };

  // Confirm Save Mock
  const handleConfirmSaveMock = () => {
    let questionsToSave = bankQuestions;
    if (questionsToSave.length === 0 && rawPastedText.trim().length > 0) {
      const result = parseRawTextToQuestionBank(rawPastedText);
      questionsToSave = result.questions;
      setBankQuestions(result.questions);
      setDuplicatesList(result.duplicates);
    }

    const validOnly = questionsToSave.filter((q) => q.isValid);
    const count = validOnly.length;
    const finalTitle = saveMockName.trim() || `SSC CGL Custom Mock (${count} Qs)`;

    const counts: Record<string, number> = {
      Reasoning: 0,
      'General Awareness': 0,
      'Quantitative Aptitude': 0,
      English: 0,
      Other: 0,
    };
    validOnly.forEach((q) => {
      if (q.subject === 'Reasoning') counts.Reasoning++;
      else if (q.subject === 'General Awareness') counts['General Awareness']++;
      else if (q.subject === 'Quantitative Aptitude') counts['Quantitative Aptitude']++;
      else if (q.subject === 'English') counts.English++;
      else counts.Other++;
    });

    const newSavedMock: SavedCustomMock = {
      id: `saved-mock-${Date.now()}`,
      title: finalTitle,
      savedAt: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      rawText: rawPastedText,
      durationMinutes: generationMode === 'sectional' ? sectionalDurationMinutes : fullMockDurationMinutes,
      strictSectionalTimer: generationMode === 'full' ? isStrictSectionalTimerActive : false,
      orderMode: fullMockOrder,
      totalQuestions: count,
      subjectCounts: counts,
      notes: saveMockNotes.trim() || undefined,
    };

    const updated = [newSavedMock, ...savedMocks.filter((m) => m.title.toLowerCase() !== finalTitle.toLowerCase())];
    saveMocksToStorage(updated);
    setIsSaveModalOpen(false);

    setSaveSuccessMessage(`Mock "${finalTitle}" saved successfully! (${count} Questions)`);
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 5000);
  };

  // Load Saved Mock
  const handleLoadSavedMock = (mock: SavedCustomMock) => {
    setRawPastedText(mock.rawText);
    const result = parseRawTextToQuestionBank(mock.rawText);
    setBankQuestions(result.questions);
    setDuplicatesList(result.duplicates);
    setFullMockTitle(mock.title);
    setFullMockDurationMinutes(mock.durationMinutes);
    setIsStrictSectionalTimerActive(mock.strictSectionalTimer);
    setFullMockOrder(mock.orderMode || 'by_section');
    setShowSavedMocksDrawer(false);

    setSaveSuccessMessage(`Loaded "${mock.title}" (${mock.totalQuestions} Qs) into editor!`);
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 4000);
  };

  // Directly Launch Exam from Saved Mock
  const handleLaunchSavedMockDirectly = (mock: SavedCustomMock) => {
    const result = parseRawTextToQuestionBank(mock.rawText);
    const validOnes = result.questions.filter((q) => q.isValid);
    if (validOnes.length === 0) {
      alert('This saved mock has no valid questions to start.');
      return;
    }
    const examQuestions = bankQuestionsToExamQuestions(validOnes, mock.orderMode || 'by_section');
    setShowSavedMocksDrawer(false);
    onStartCustomExam(examQuestions, mock.durationMinutes, mock.title, mock.strictSectionalTimer);
  };

  // Delete Saved Mock
  const handleDeleteSavedMock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this saved mock test?')) {
      const updated = savedMocks.filter((m) => m.id !== id);
      saveMocksToStorage(updated);
    }
  };

  // Export All Saved Mocks as JSON
  const handleExportSavedMocks = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedMocks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ssc_cgl_saved_mocks_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import Saved Mocks from JSON file
  const handleImportSavedMocks = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          const merged = [...imported, ...savedMocks];
          const seen = new Set<string>();
          const unique = merged.filter((item) => {
            if (!item.id || seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
          });
          saveMocksToStorage(unique);
          setSaveSuccessMessage(`Successfully imported ${imported.length} saved mock(s)!`);
          setTimeout(() => setSaveSuccessMessage(null), 4000);
        }
      } catch (err) {
        alert('Invalid JSON file format for saved mocks.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Duplicate Actions
  const handleKeepBothDuplicates = (qNum2: number) => {
    setDuplicatesList((prev) => prev.filter((d) => d.qNum2 !== qNum2));
    setBankQuestions((prev) =>
      prev.map((q) => (q.questionNumber === qNum2 ? { ...q, isDuplicate: false, duplicateWithNumber: undefined } : q))
    );
  };

  const handleRemoveDuplicate = (qNum2: number) => {
    setDuplicatesList((prev) => prev.filter((d) => d.qNum2 !== qNum2));
    setBankQuestions((prev) => prev.filter((q) => q.questionNumber !== qNum2));
  };

  // Dynamic Cascading Filters (Strictly derived from questions currently in the bank!)
  // Hierarchy: Subject → Chapter → Subtopic → Number of Questions
  const availableSubjects = useMemo(() => {
    const set = new Set<string>();
    validQuestions.forEach((q) => {
      if (q.subject) set.add(q.subject);
    });
    return Array.from(set).sort();
  }, [validQuestions]);

  const availableChapters = useMemo(() => {
    const set = new Set<string>();
    validQuestions.forEach((q) => {
      if (selectedSubject === 'All' || q.subject === selectedSubject) {
        const chap = q.chapter || q.topic;
        if (chap) set.add(chap);
      }
    });
    return Array.from(set).sort();
  }, [validQuestions, selectedSubject]);

  const availableSubtopics = useMemo(() => {
    const set = new Set<string>();
    validQuestions.forEach((q) => {
      const matchSubject = selectedSubject === 'All' || q.subject === selectedSubject;
      const chap = q.chapter || q.topic;
      const matchChapter = selectedChapter === 'All' || chap === selectedChapter;
      if (matchSubject && matchChapter && q.subtopic) {
        set.add(q.subtopic);
      }
    });
    return Array.from(set).sort();
  }, [validQuestions, selectedSubject, selectedChapter]);

  // Querying questions matching Sectional Filters
  // CRITICAL USER REQUIREMENT: Only questions carrying that exact subtopic should be selected.
  const filteredSectionalQuestions = useMemo(() => {
    return validQuestions.filter((q) => {
      if (selectedSubject !== 'All' && q.subject !== selectedSubject) return false;
      const chap = q.chapter || q.topic;
      if (selectedChapter !== 'All' && chap !== selectedChapter) return false;
      if (selectedSubtopic !== 'All' && q.subtopic.trim().toLowerCase() !== selectedSubtopic.trim().toLowerCase()) {
        return false;
      }
      if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) return false;
      return true;
    });
  }, [validQuestions, selectedSubject, selectedChapter, selectedSubtopic, selectedDifficulty]);

  // Requested count vs Available count
  const requestedCountNumber = useMemo(() => {
    if (selectedQuestionCount === 'All') return filteredSectionalQuestions.length;
    if (selectedQuestionCount === 'Custom') return customQuestionCount;
    return parseInt(selectedQuestionCount, 10) || filteredSectionalQuestions.length;
  }, [selectedQuestionCount, customQuestionCount, filteredSectionalQuestions.length]);

  const isFewerThanRequested = requestedCountNumber > filteredSectionalQuestions.length && filteredSectionalQuestions.length > 0;

  // AI Reclassify Handlers (When user explicitly chooses AI Reclassification)
  const handleReclassifySingle = (numericId: number) => {
    setBankQuestions((prev) =>
      prev.map((q) => (q.numericId === numericId ? reclassifyBankQuestion(q) : q))
    );
  };

  const handleReclassifyAll = () => {
    setBankQuestions((prev) => prev.map((q) => reclassifyBankQuestion(q)));
  };

  const handleReclassifyInModal = () => {
    if (!editingQuestion) return;
    const reclassified = reclassifyBankQuestion(editingQuestion);
    setEditingQuestion(reclassified);
  };

  // Single Question Actions in Bank
  const handleDeleteQuestion = (numericId: number) => {
    setBankQuestions((prev) => prev.filter((q) => q.numericId !== numericId));
  };

  const handleDuplicateQuestion = (q: ParsedBankQuestion) => {
    const newQ: ParsedBankQuestion = {
      ...q,
      id: `bank-q-${Date.now()}`,
      numericId: Math.max(...bankQuestions.map((x) => x.numericId), 9200) + 1,
      questionNumber: Math.max(...bankQuestions.map((x) => x.questionNumber), 0) + 1,
      text: `${q.text} (Copy)`,
    };
    setBankQuestions((prev) => [...prev, newQ]);
  };

  const handleOpenEditModal = (q: ParsedBankQuestion) => {
    setEditingQuestion({ ...q });
  };

  const handleSaveEditedQuestion = () => {
    if (!editingQuestion) return;

    // Re-validate edited question
    const issues: string[] = [];
    if (!editingQuestion.text.trim()) issues.push('Question text is empty');
    if (!editingQuestion.options.A.trim()) issues.push('Missing option A');
    if (!editingQuestion.options.B.trim()) issues.push('Missing option B');
    if (!editingQuestion.options.C.trim()) issues.push('Missing option C');
    if (!editingQuestion.options.D.trim()) issues.push('Missing option D');
    if (!editingQuestion.correctAnswer) issues.push('Missing answer key');

    const finalChap = editingQuestion.chapter || editingQuestion.topic || 'General';

    const updated: ParsedBankQuestion = {
      ...editingQuestion,
      chapter: finalChap,
      topic: finalChap,
      isValid: issues.length === 0,
      validationIssues: issues,
    };

    setBankQuestions((prev) => prev.map((q) => (q.numericId === updated.numericId ? updated : q)));
    setEditingQuestion(null);
  };

  // Subject Detection Handlers (All 4 SSC CGL Subjects)
  const handleDetectSubjectsByContent = () => {
    const updated = detectSubjectForBankQuestions(bankQuestions, 'ai_content');
    setBankQuestions(updated);
  };

  const handleDetectSubjects100Split = () => {
    const updated = detectSubjectForBankQuestions(bankQuestions, 'ssc_100_split');
    setBankQuestions(updated);
  };

  // Launch Full Mock Test
  const handleLaunchFullMock = (strictTimer: boolean = isStrictSectionalTimerActive) => {
    if (validQuestions.length === 0) return;
    const examQuestions = bankQuestionsToExamQuestions(validQuestions, fullMockOrder);
    const title = fullMockTitle.trim() || `SSC CGL Full Mock (${examQuestions.length} Qs)`;
    onStartCustomExam(examQuestions, fullMockDurationMinutes, title, strictTimer);
  };

  // Launch Sectional Mock Test (Exact subtopic drill)
  const handleLaunchSectionalMock = () => {
    if (filteredSectionalQuestions.length === 0) return;

    // Select questions count
    let pool = [...filteredSectionalQuestions];
    if (sectionalOrder === 'random') {
      pool = pool.sort(() => Math.random() - 0.5);
    }
    const finalSelection = pool.slice(0, Math.min(requestedCountNumber, pool.length));

    const examQuestions = bankQuestionsToExamQuestions(finalSelection, sectionalOrder === 'original');

    let dynamicTitle = sectionalMockTitle.trim();
    if (!dynamicTitle) {
      if (selectedSubtopic !== 'All') {
        dynamicTitle = `SSC CGL — ${selectedSubtopic} (${finalSelection.length} Qs)`;
      } else if (selectedChapter !== 'All') {
        dynamicTitle = `SSC CGL — ${selectedChapter} (${finalSelection.length} Qs)`;
      } else if (selectedSubject !== 'All') {
        dynamicTitle = `SSC CGL — ${selectedSubject} Sectional Mock (${finalSelection.length} Qs)`;
      } else {
        dynamicTitle = `SSC CGL Sectional Mock (${finalSelection.length} Qs)`;
      }
    }

    onStartCustomExam(examQuestions, sectionalDurationMinutes, dynamicTitle, false);
  };

  // Search filtered questions in Bank Browser
  const searchedBankQuestions = useMemo(() => {
    if (!bankSearchQuery.trim()) return bankQuestions;
    const query = bankSearchQuery.toLowerCase();
    return bankQuestions.filter(
      (q) =>
        q.text.toLowerCase().includes(query) ||
        q.topic.toLowerCase().includes(query) ||
        q.subtopic.toLowerCase().includes(query) ||
        q.subject.toLowerCase().includes(query) ||
        `q${q.questionNumber}`.toLowerCase().includes(query)
    );
  }, [bankQuestions, bankSearchQuery]);

  return (
    <div className="bg-slate-800/95 rounded-2xl border border-slate-700 shadow-2xl p-4 sm:p-7 space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-700">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 text-purple-200 border border-purple-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Centralized SSC CGL Question Bank &amp; Mock Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Paste Questions &amp; Auto-Generate Mock Tests
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Paste multiple questions in plain text. The engine automatically parses, validates, classifies into SSC CGL
            subject/topic/subtopic, and builds interactive <strong>Full</strong> or <strong>Sectional</strong> tests.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {savedMocks.length > 0 && (
            <button
              type="button"
              onClick={() => setShowSavedMocksDrawer(true)}
              className="py-2 px-3.5 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Open your library of saved mocks"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Saved Mocks ({savedMocks.length})</span>
            </button>
          )}
          <button
            onClick={handleLoadSample5}
            className="py-2 px-3.5 rounded-xl text-xs font-semibold bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 transition flex items-center gap-1.5 cursor-pointer"
            title="Load the 5 example SSC CGL questions"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Load 5 Sample Qs</span>
          </button>
          <button
            onClick={handleClearText}
            className="py-2 px-3 rounded-xl text-xs font-semibold bg-slate-700/60 hover:bg-rose-500/30 text-slate-300 hover:text-rose-200 border border-slate-600 transition flex items-center gap-1 cursor-pointer"
            title="Clear text"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="py-2 px-3 rounded-xl text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-300 transition cursor-pointer"
            >
              Back to Home
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          10. PASTE QUESTIONS SECTION
          ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
          <label className="font-bold text-slate-200 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-purple-400" />
            Paste Questions (Plain Text)
          </label>
          <span className="text-[11px] text-slate-400">
            Accepts: Q1. [Text] A) ... B) ... C) ... D) ... Answer: A Explanation: ...
          </span>
        </div>

        <textarea
          value={rawPastedText}
          onChange={(e) => setRawPastedText(e.target.value)}
          rows={11}
          placeholder={`Paste questions in this format:

Q1. Question text...
A) Option A
B) Option B
C) Option C
D) Option D
Answer: A
Explanation: ...`}
          className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs sm:text-sm font-mono leading-relaxed focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-y shadow-inner"
        />

        {/* Parse & Save Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
            <button
              type="button"
              onClick={handleParseQuestions}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/40 transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>Parse Questions into Bank</span>
            </button>

            {/* User Requested: "and give one button after pasting save this mock also" */}
            <button
              type="button"
              onClick={handleOpenSaveModal}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/50 transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer border border-emerald-400/40"
              title="Save this pasted mock test, questions and settings so you can access and re-attempt anytime"
            >
              <Bookmark className="w-4 h-4 text-emerald-200" />
              <span>Save This Mock</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {savedMocks.length > 0 && (
              <button
                type="button"
                onClick={() => setShowSavedMocksDrawer(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition flex items-center gap-1.5 cursor-pointer"
                title="View your saved mocks"
              >
                <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>My Saved Mocks ({savedMocks.length})</span>
              </button>
            )}
            <span className="text-[11px] text-slate-400 hidden lg:inline">
              Click Parse to validate options, or Save This Mock to store it in your library.
            </span>
          </div>
        </div>

        {/* Save Confirmation Notification Banner */}
        {saveSuccessMessage && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveSuccessMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowSavedMocksDrawer(true)}
              className="px-2.5 py-1 rounded-md bg-emerald-800/60 hover:bg-emerald-700/60 text-emerald-100 font-bold text-[11px] transition cursor-pointer"
            >
              View Saved Mocks →
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          5. & 6. VALIDATION & QUALITY CONTROL PANEL
          ========================================================================= */}
      {totalDetected > 0 && (
        <div className="space-y-4">
          {/* Validation Metrics Banner */}
          <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-700 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Questions detected:</span>
                <span className="px-3 py-0.5 rounded-full font-bold font-mono text-base bg-purple-900/60 text-purple-200 border border-purple-700">
                  {totalDetected}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Valid:</span>
                <span className="px-3 py-0.5 rounded-full font-bold font-mono text-base bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {validCount}
                </span>
              </div>

              {needsAttentionCount > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Needs attention:</span>
                  <span className="px-3 py-0.5 rounded-full font-bold font-mono text-base bg-rose-950 text-rose-300 border border-rose-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    {needsAttentionCount}
                  </span>
                </div>
              ) : (
                <div className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>All questions valid &amp; ready</span>
                </div>
              )}

              {duplicatesList.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Duplicates:</span>
                  <span className="px-3 py-0.5 rounded-full font-bold font-mono text-xs bg-amber-950 text-amber-300 border border-amber-700 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    {duplicatesList.length}
                  </span>
                </div>
              )}
            </div>

            {/* Toggle Browser Button */}
            <button
              onClick={() => setShowBankBrowser(!showBankBrowser)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-purple-300" />
              <span>{showBankBrowser ? 'Hide Question Bank Browser' : 'Browse & Edit Bank Questions'}</span>
              {showBankBrowser ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Malformed Questions Warning Panel */}
          {needsAttentionCount > 0 && showNeedsAttentionPanel && (
            <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-2xl text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  {needsAttentionCount} Question{needsAttentionCount > 1 ? 's' : ''} Need{needsAttentionCount === 1 ? 's' : ''} Attention Before Import:
                </span>
                <button
                  onClick={() => setShowNeedsAttentionPanel(false)}
                  className="text-slate-400 hover:text-slate-200 text-xs"
                >
                  Dismiss
                </button>
              </div>

              <div className="space-y-2">
                {invalidQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="p-3 bg-slate-900/90 border border-rose-800/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-rose-300">Q{q.questionNumber}:</span>
                        <span className="text-slate-200 line-clamp-1">{q.text}</span>
                      </div>
                      <div className="text-[11px] text-rose-400 space-y-0.5">
                        {q.validationIssues.map((issue, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <span>•</span>
                            <span>{issue}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenEditModal(q)}
                      className="px-3 py-1.5 rounded-lg font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Fix / Edit Question</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Duplicate Detection Alert Banner */}
          {duplicatesList.length > 0 && (
            <div className="p-4 bg-amber-950/40 border border-amber-800/80 rounded-2xl text-xs space-y-3">
              <span className="font-bold text-amber-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Possible Duplicate Questions Detected ({duplicatesList.length}):
              </span>

              <div className="space-y-2">
                {duplicatesList.map((dup, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-900/90 border border-amber-800/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <span className="font-semibold text-amber-300">
                        Possible duplicate: Q{dup.qNum1} and Q{dup.qNum2}
                      </span>
                      <p className="text-slate-300 text-[11px] line-clamp-1 italic">"{dup.preview}..."</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleKeepBothDuplicates(dup.qNum2)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                      >
                        Keep Both
                      </button>
                      <button
                        onClick={() => handleRemoveDuplicate(dup.qNum2)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700 cursor-pointer"
                      >
                        Remove Q{dup.qNum2}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODE SELECTION (FULL MOCK vs SECTIONAL / SUBTOPIC MOCK)
          Both modes strictly query the same Centralized Question Bank!
          ========================================================================= */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-700 pb-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Choose Mock Generation Mode:
          </label>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center rounded-xl bg-slate-900 p-1 border border-slate-700 text-xs">
            <button
              onClick={() => setGenerationMode('full')}
              className={`px-4 py-1.5 rounded-lg font-bold transition flex items-center gap-2 cursor-pointer ${
                generationMode === 'full'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>1. Full Mock</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-950 text-blue-200">
                {validCount} Qs
              </span>
            </button>

            <button
              onClick={() => setGenerationMode('sectional')}
              className={`px-4 py-1.5 rounded-lg font-bold transition flex items-center gap-2 cursor-pointer ${
                generationMode === 'sectional'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              <span>2. Sectional / Subtopic Mock</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-200">
                Filtered
              </span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            MODE 1: FULL MOCK CONTROLS
            ========================================================================= */}
        {generationMode === 'full' ? (
          <div className="p-5 bg-slate-900/80 rounded-2xl border border-blue-900/50 space-y-5 animate-in fade-in">
            {/* Header & Badges */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-blue-300 flex items-center gap-2">
                  <span>Full Mock Mode (All 4 Subjects Sectional Mock)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Includes all <strong>{validCount}</strong> valid questions currently in the imported bank.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60 font-semibold">
                  Official SSC CGL Pattern
                </span>
                <div className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>+2.00 Correct / −0.50 Negative</span>
                </div>
              </div>
            </div>

            {/* 1. All 4 Subjects Breakdown & Auto-Detection Card */}
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>All 4 Subjects Distribution:</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Questions are grouped into official SSC CGL sections. Use the detection buttons to auto-classify any unassigned questions.
                  </p>
                </div>

                {/* Quick Auto-Detection Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleDetectSubjectsByContent}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Inspects question content, formulas, vocabulary and assigns each question to Reasoning, Quant, English, or GA"
                  >
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span>⚡ Auto-Detect Each Q's Subject</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDetectSubjects100Split}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Evenly divides questions into standard 4 SSC sections: Q1-25 Reasoning, Q26-50 GA, Q51-75 Quant, Q76-100 English"
                  >
                    <span>🎯 25 Qs × 4 Section Split</span>
                  </button>
                </div>
              </div>

              {/* 4 Subject Counts Display */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {/* 1. Reasoning */}
                <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-800/40 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-blue-300">🧠 Reasoning</div>
                    <div className="text-[10px] text-slate-400">PART-A</div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black font-mono text-blue-200">
                      {subjectBreakdown.Reasoning}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Qs</span>
                  </div>
                </div>

                {/* 2. General Awareness */}
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-emerald-300">🌍 Gen Awareness</div>
                    <div className="text-[10px] text-slate-400">PART-B</div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black font-mono text-emerald-200">
                      {subjectBreakdown['General Awareness']}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Qs</span>
                  </div>
                </div>

                {/* 3. Quantitative Aptitude */}
                <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/40 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-amber-300">📐 Quant Aptitude</div>
                    <div className="text-[10px] text-slate-400">PART-C</div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black font-mono text-amber-200">
                      {subjectBreakdown['Quantitative Aptitude']}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Qs</span>
                  </div>
                </div>

                {/* 4. English Comprehension */}
                <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-800/40 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-purple-300">📖 English Comp</div>
                    <div className="text-[10px] text-slate-400">PART-D</div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black font-mono text-purple-200">
                      {subjectBreakdown.English}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Qs</span>
                  </div>
                </div>
              </div>

              {subjectBreakdown.Other > 0 && (
                <div className="text-[11px] text-amber-400 bg-amber-950/30 px-3 py-1.5 rounded-lg border border-amber-900/50 flex items-center justify-between">
                  <span>Notice: {subjectBreakdown.Other} question(s) have unassigned subjects. Click "⚡ Auto-Detect Each Q's Subject" above to categorize them automatically.</span>
                </div>
              )}
            </div>

            {/* 2. Timing Mode Selection: 15 Min Sectional Timer vs Standard Timer */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Timer Mode:</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Mode A: 15 Min Strict Sectional Timer */}
                <button
                  type="button"
                  onClick={() => {
                    setIsStrictSectionalTimerActive(true);
                    setFullMockDurationMinutes(60);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer relative ${
                    isStrictSectionalTimerActive
                      ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span>15 Min / Section Strict Sectional Timer</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      SSC CGL Strict
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    <strong>4 Subjects × 15 Minutes = 60 Min Total</strong>. Each section has a strict 15-minute countdown. Automatically advances to the next section when time expires.
                  </p>
                </button>

                {/* Mode B: Open Single Timer */}
                <button
                  type="button"
                  onClick={() => setIsStrictSectionalTimerActive(false)}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer relative ${
                    !isStrictSectionalTimerActive
                      ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-blue-300 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span>Open Single Timer (Flexible 60 Mins)</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                      Flexible
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Single 60-minute overall countdown. Allows free hopping back and forth between Reasoning, GA, Quant, and English at any time.
                  </p>
                </button>
              </div>
            </div>

            {/* 3. Settings Grid: Title, Duration, Question Order */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {/* Exam Title */}
              <div className="space-y-1.5 sm:col-span-1">
                <label className="font-semibold text-slate-300">Mock Exam Title:</label>
                <input
                  type="text"
                  value={fullMockTitle}
                  onChange={(e) => setFullMockTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Duration Minutes */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">
                  {isStrictSectionalTimerActive ? 'Total Exam Duration (4 × 15m):' : 'Exam Duration (Minutes):'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={fullMockDurationMinutes}
                    onChange={(e) => setFullMockDurationMinutes(parseInt(e.target.value, 10) || 60)}
                    className="w-24 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs font-mono font-bold focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-slate-400 text-xs">
                    {isStrictSectionalTimerActive ? 'Minutes (15 min/sec)' : 'Minutes'}
                  </span>
                </div>
              </div>

              {/* Question Order */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Question Ordering:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFullMockOrder('by_section')}
                    className={`py-2 px-1 rounded-xl border text-[11px] font-semibold text-center transition cursor-pointer ${
                      fullMockOrder === 'by_section'
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                    title="Groups questions cleanly into standard SSC sections (Reasoning → GA → Quant → English)"
                  >
                    By 4 Sections
                  </button>

                  <button
                    type="button"
                    onClick={() => setFullMockOrder('original')}
                    className={`py-2 px-1 rounded-xl border text-[11px] font-semibold text-center transition cursor-pointer ${
                      fullMockOrder === 'original'
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Original
                  </button>

                  <button
                    type="button"
                    onClick={() => setFullMockOrder('random')}
                    className={`py-2 px-1 rounded-xl border text-[11px] font-semibold text-center transition cursor-pointer ${
                      fullMockOrder === 'random'
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Shuffle
                  </button>
                </div>
              </div>
            </div>

            {/* Launch Buttons */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400">
                Ready to take test: <strong>{validCount} Questions</strong> • {fullMockDurationMinutes} Minutes total •{' '}
                {isStrictSectionalTimerActive ? (
                  <strong className="text-emerald-400">Strict 15 Min / Section</strong>
                ) : (
                  'Flexible Timer'
                )}
              </span>

              <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
                <button
                  type="button"
                  disabled={validCount === 0}
                  onClick={handleOpenSaveModal}
                  className={`px-4 py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                    validCount > 0
                      ? 'bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 border-amber-500/40 shadow-md'
                      : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                  }`}
                  title="Save this mock configuration to your library"
                >
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span>Save Mock</span>
                </button>

                <button
                  disabled={validCount === 0}
                  onClick={() => handleLaunchFullMock(true)}
                  className={`flex-1 sm:flex-initial px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-xl transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer ${
                    validCount > 0
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-950/60'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                  title="Launch with strict 15-minute timer per section (all 4 subjects)"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start 4-Subject Mock (15 Min/Sec) →</span>
                </button>

                <button
                  disabled={validCount === 0}
                  onClick={() => handleLaunchFullMock(false)}
                  className={`px-4 py-3 rounded-xl font-semibold text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer`}
                  title="Launch with single flexible 60-minute timer across all questions"
                >
                  <span>Open Full Mock</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
              MODE 2: SECTIONAL / SUBTOPIC MOCK CONTROLS
              Cascading Dynamic Filters strictly matching the imported bank!
              ========================================================================= */
          <div className="p-5 bg-slate-900/80 rounded-2xl border border-emerald-900/50 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-emerald-300 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-400" />
                  <span>Sectional &amp; Subtopic Mock Generator</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Filters dynamically adjust based exclusively on questions available in your imported question bank.
                </p>
              </div>

              {/* Live Count Indicator */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Available matching filters:</span>
                <span className="px-3 py-1 rounded-full font-bold font-mono text-xs bg-emerald-950 text-emerald-300 border border-emerald-700">
                  {filteredSectionalQuestions.length} questions
                </span>
              </div>
            </div>

            {/* Active Hierarchy Indicator */}
            <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-950/70 rounded-xl border border-emerald-900/60 text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mock Hierarchy:</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-900/40 text-emerald-300 font-bold border border-emerald-700/50">
                {selectedSubject}
              </span>
              <span className="text-slate-500 font-bold">→</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-900/40 text-emerald-300 font-bold border border-emerald-700/50">
                {selectedChapter}
              </span>
              <span className="text-slate-500 font-bold">→</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-900/40 text-emerald-300 font-bold border border-emerald-700/50">
                {selectedSubtopic}
              </span>
              <span className="text-slate-500 font-bold">→</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white font-bold shadow-xs">
                {selectedQuestionCount === 'All'
                  ? `${filteredSectionalQuestions.length} Questions`
                  : `${requestedCountNumber} Questions`}
              </span>
              {selectedSubtopic !== 'All' && (
                <span className="text-[11px] text-emerald-300/90 font-medium sm:ml-auto">
                  🎯 Strict match: Only questions carrying exact subtopic &ldquo;{selectedSubtopic}&rdquo; will be selected.
                </span>
              )}
            </div>

            {/* Filter Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {/* 1. Subject Filter */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Subject:</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setSelectedChapter('All');
                    setSelectedSubtopic('All');
                  }}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="All">All Subjects ({validCount})</option>
                  {availableSubjects.map((sub) => {
                    const count = validQuestions.filter((q) => q.subject === sub).length;
                    return (
                      <option key={sub} value={sub}>
                        {sub} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* 2. Chapter Filter (Dynamic) */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Chapter:</label>
                <select
                  value={selectedChapter}
                  onChange={(e) => {
                    setSelectedChapter(e.target.value);
                    setSelectedSubtopic('All');
                  }}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="All">All Chapters ({filteredSectionalQuestions.length})</option>
                  {availableChapters.map((chap) => {
                    const count = validQuestions.filter(
                      (q) =>
                        (selectedSubject === 'All' || q.subject === selectedSubject) &&
                        (q.chapter === chap || q.topic === chap)
                    ).length;
                    return (
                      <option key={chap} value={chap}>
                        {chap} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* 3. Subtopic Filter (Dynamic) */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Subtopic:</label>
                <select
                  value={selectedSubtopic}
                  onChange={(e) => setSelectedSubtopic(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="All">All Subtopics ({filteredSectionalQuestions.length})</option>
                  {availableSubtopics.map((subtop) => {
                    const count = validQuestions.filter(
                      (q) =>
                        (selectedSubject === 'All' || q.subject === selectedSubject) &&
                        (selectedChapter === 'All' || q.chapter === selectedChapter || q.topic === selectedChapter) &&
                        q.subtopic === subtop
                    ).length;
                    return (
                      <option key={subtop} value={subtop}>
                        {subtop} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* 4. Number of Questions */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Number of Questions:</label>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedQuestionCount}
                    onChange={(e) => setSelectedQuestionCount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="20">20 Questions (Subtopic Drill)</option>
                    <option value="5">5 Questions</option>
                    <option value="10">10 Questions</option>
                    <option value="15">15 Questions</option>
                    <option value="25">25 Questions</option>
                    <option value="50">50 Questions</option>
                    <option value="All">All Available ({filteredSectionalQuestions.length})</option>
                    <option value="Custom">Custom Count</option>
                  </select>

                  {selectedQuestionCount === 'Custom' && (
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={customQuestionCount}
                      onChange={(e) => setCustomQuestionCount(parseInt(e.target.value, 10) || 1)}
                      className="w-20 px-2.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs font-mono font-bold"
                    />
                  )}
                </div>
              </div>

              {/* 5. Difficulty Filter */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Difficulty:</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* 6. Question Order */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Question Selection / Order:</label>
                <select
                  value={sectionalOrder}
                  onChange={(e) => setSectionalOrder(e.target.value as 'random' | 'original')}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="random">Random Selection</option>
                  <option value="original">Original Order</option>
                </select>
              </div>
            </div>

            {/* Notice if fewer questions available than requested */}
            {isFewerThanRequested && (
              <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  Only {filteredSectionalQuestions.length} question{filteredSectionalQuestions.length > 1 ? 's' : ''} are
                  available in this category. The mock test will proceed with all available questions without duplicate
                  padding.
                </span>
              </div>
            )}

            {/* Launch Sectional Mock Bar */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>
                  Will launch: <strong>{Math.min(requestedCountNumber, filteredSectionalQuestions.length)} Questions</strong>{' '}
                  • {sectionalDurationMinutes} Minutes Duration
                </span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={filteredSectionalQuestions.length === 0}
                  onClick={handleOpenSaveModal}
                  className={`px-4 py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                    filteredSectionalQuestions.length > 0
                      ? 'bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 border-amber-500/40 shadow-md'
                      : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                  }`}
                  title="Save this sectional mock configuration"
                >
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span>Save Mock</span>
                </button>

                <button
                  disabled={filteredSectionalQuestions.length === 0}
                  onClick={handleLaunchSectionalMock}
                  className={`flex-1 sm:flex-initial px-7 py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-xl transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer ${
                    filteredSectionalQuestions.length > 0
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-900/40'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    Generate Mock ({Math.min(requestedCountNumber, filteredSectionalQuestions.length)} Qs) →
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          QUESTION BANK BROWSER & MANUAL OVERRIDE SECTION
          ========================================================================= */}
      {showBankBrowser && (
        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-700 space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Centralized Question Bank ({bankQuestions.length} Questions)</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Review auto-classified categories, manually override fields, or fix malformed entries.
              </p>
            </div>

            {/* Top Bar Actions & Search Input */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleReclassifyAll}
                className="px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0"
                title="Run automatic AI classification on all questions in the bank"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>AI Reclassify All</span>
              </button>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={bankSearchQuery}
                  onChange={(e) => setBankSearchQuery(e.target.value)}
                  placeholder="Search text, chapter, Q#..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Question Cards Grid */}
          <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
            {searchedBankQuestions.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">No questions found matching your search.</div>
            ) : (
              searchedBankQuestions.map((q) => (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-2.5 transition ${
                    q.isValid ? 'bg-slate-800/80 border-slate-700' : 'bg-rose-950/30 border-rose-800/70'
                  }`}
                >
                  {/* Top Badges & Actions */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-purple-300">Q{q.questionNumber}.</span>
                      {q.hasExplicitHeading ? (
                        <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-700/80 flex items-center gap-1">
                          <span>🏷️ Heading:</span>
                          <span>{q.subject} → {q.chapter} → {q.subtopic}</span>
                        </span>
                      ) : (
                        <>
                          <span className="bg-slate-700 text-slate-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                            {q.subject}
                          </span>
                          <span className="bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded text-[10px] border border-blue-700">
                            {q.chapter || q.topic}
                          </span>
                          {q.subtopic && (
                            <span className="bg-purple-900/60 text-purple-200 px-2 py-0.5 rounded text-[10px] border border-purple-700">
                              {q.subtopic}
                            </span>
                          )}
                        </>
                      )}
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          q.difficulty === 'Easy'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : q.difficulty === 'Hard'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleReclassifySingle(q.numericId)}
                        className="p-1 rounded bg-slate-700 hover:bg-purple-600 text-slate-300 hover:text-white transition cursor-pointer"
                        title="AI Reclassify (Override with AI classification)"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(q)}
                        className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white"
                        title="Edit Question & Category"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicateQuestion(q)}
                        className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white"
                        title="Duplicate Question"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.numericId)}
                        className="p-1 rounded bg-slate-700 hover:bg-rose-600 text-slate-300 hover:text-white"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="text-slate-200 font-medium whitespace-pre-wrap leading-relaxed">{q.text}</div>

                  {/* Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                      const isCorrect = q.correctAnswer === optKey;
                      return (
                        <div
                          key={optKey}
                          className={`px-2.5 py-1 rounded-lg border text-[11px] flex items-center justify-between ${
                            isCorrect
                              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-semibold'
                              : 'bg-slate-900/60 border-slate-700/80 text-slate-300'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                              }`}
                            >
                              {optKey}
                            </span>
                            <span>{q.options[optKey]}</span>
                          </span>
                          {isCorrect && <span className="text-[10px] text-emerald-400 font-bold">Answer ✓</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation if present */}
                  {q.explanation && (
                    <div className="p-2 bg-slate-900/60 rounded-lg text-[11px] text-slate-400 border border-slate-800/80 leading-relaxed">
                      <strong className="text-slate-300">Explanation: </strong>
                      {q.explanation}
                    </div>
                  )}

                  {/* Validation issues tags if invalid */}
                  {!q.isValid && (
                    <div className="text-[11px] text-rose-400 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{q.validationIssues.join(' • ')}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          EDIT QUESTION MODAL (Quick Fix / Manual Classification Override)
          ========================================================================= */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 space-y-4 text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-purple-400" />
                Edit Question {editingQuestion.questionNumber} &amp; Metadata
              </span>
              <button
                onClick={() => setEditingQuestion(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Question Text */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Question Text:</label>
              <textarea
                rows={3}
                value={editingQuestion.text}
                onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs font-mono"
              />
            </div>

            {/* Options A, B, C, D */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['A', 'B', 'C', 'D'] as const).map((key) => (
                <div key={key} className="space-y-1">
                  <label className="font-semibold text-slate-300">Option {key}:</label>
                  <input
                    type="text"
                    value={editingQuestion.options[key]}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        options: { ...editingQuestion.options, [key]: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs"
                  />
                </div>
              ))}
            </div>

            {/* Correct Answer & Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Correct Answer Key:</label>
                <select
                  value={editingQuestion.correctAnswer}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      correctAnswer: e.target.value as 'A' | 'B' | 'C' | 'D',
                    })
                  }
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs cursor-pointer"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Difficulty:</label>
                <select
                  value={editingQuestion.difficulty}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      difficulty: e.target.value as 'Easy' | 'Moderate' | 'Hard',
                    })
                  }
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs cursor-pointer"
                >
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Classification: Subject, Chapter, Subtopic Override & AI Reclassify Button */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-300">Hierarchy &amp; Metadata:</span>
                <button
                  type="button"
                  onClick={handleReclassifyInModal}
                  className="px-2.5 py-1 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800 text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>AI Reclassify This Question</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-400 text-[11px]">Subject:</label>
                  <select
                    value={editingQuestion.subject}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        subject: e.target.value as any,
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs"
                  >
                    <option value="Reasoning">Reasoning</option>
                    <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                    <option value="English">English</option>
                    <option value="General Awareness">General Awareness</option>
                    <option value="Computer">Computer</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-400 text-[11px]">Chapter:</label>
                  <input
                    type="text"
                    value={editingQuestion.chapter || editingQuestion.topic}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        chapter: e.target.value,
                        topic: e.target.value,
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-400 text-[11px]">Subtopic:</label>
                  <input
                    type="text"
                    value={editingQuestion.subtopic}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, subtopic: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Explanation:</label>
              <textarea
                rows={2}
                value={editingQuestion.explanation}
                onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                placeholder="Explanation not provided."
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs"
              />
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditedQuestion}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SAVE THIS MOCK MODAL
          ========================================================================= */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Save This Mock Test</h3>
                  <p className="text-xs text-slate-400">Save to your browser library for instant practice &amp; re-attempts</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSaveModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mock Info / Preview */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Mock Name / Title:
                </label>
                <input
                  type="text"
                  value={saveMockName}
                  onChange={(e) => setSaveMockName(e.target.value)}
                  placeholder="e.g. SSC CGL Full Mock 01 (100 Qs)"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Summary Chip Cards */}
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2.5">
                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Mock Structure &amp; Breakdown:</span>
                  <span className="font-mono text-emerald-400 font-black">{validCount} Questions</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-blue-950/50 border border-blue-800/40">
                    <div className="text-[10px] text-blue-300 font-bold">🧠 Reasoning</div>
                    <div className="text-sm font-mono font-black text-blue-200">{subjectBreakdown.Reasoning}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-800/40">
                    <div className="text-[10px] text-emerald-300 font-bold">🌍 GA</div>
                    <div className="text-sm font-mono font-black text-emerald-200">{subjectBreakdown['General Awareness']}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-950/50 border border-amber-800/40">
                    <div className="text-[10px] text-amber-300 font-bold">📐 Quant</div>
                    <div className="text-sm font-mono font-black text-amber-200">{subjectBreakdown['Quantitative Aptitude']}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-950/50 border border-purple-800/40">
                    <div className="text-[10px] text-purple-300 font-bold">📖 English</div>
                    <div className="text-sm font-mono font-black text-purple-200">{subjectBreakdown.English}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Duration: <strong>{generationMode === 'sectional' ? sectionalDurationMinutes : fullMockDurationMinutes} Mins</strong></span>
                  <span>Timer Mode: <strong>{isStrictSectionalTimerActive ? '15 Min/Section' : 'Flexible Timer'}</strong></span>
                </div>
              </div>

              {/* Optional Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">
                  Notes / Source (Optional):
                </label>
                <input
                  type="text"
                  value={saveMockNotes}
                  onChange={(e) => setSaveMockNotes(e.target.value)}
                  placeholder="e.g. Past Year Paper 2024, Telegram PDF, Chapter-wise drill"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsSaveModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSaveMock}
                disabled={validCount === 0}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white transition flex items-center gap-2 cursor-pointer ${
                  validCount > 0
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-950/60 active:scale-95'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>Save to My Mocks</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MY SAVED MOCKS DRAWER / MODAL
          ========================================================================= */}
      {showSavedMocksDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 text-slate-100">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    My Saved Custom Mocks ({savedMocks.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Load back into workspace or take test immediately in one click
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportSavedMocks}
                  disabled={savedMocks.length === 0}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  title="Export all saved mocks as JSON file"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Export</span>
                </button>

                <label
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1 cursor-pointer"
                  title="Import mocks from JSON backup"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Import</span>
                  <input
                    type="file"
                    accept=".json"
                    ref={fileInputRef}
                    onChange={handleImportSavedMocks}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setShowSavedMocksDrawer(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search Input */}
            {savedMocks.length > 2 && (
              <div className="px-5 pt-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={savedMocksSearch}
                    onChange={(e) => setSavedMocksSearch(e.target.value)}
                    placeholder="Search saved mocks by title or notes..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}

            {/* Content List */}
            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              {filteredSavedMocks.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
                  <div className="text-sm font-semibold text-slate-300">No saved mocks found</div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {savedMocks.length === 0
                      ? "You haven't saved any mocks yet. Paste questions and click 'Save This Mock' to store them here!"
                      : "No saved mocks match your search query."}
                  </p>
                </div>
              ) : (
                filteredSavedMocks.map((mock) => (
                  <div
                    key={mock.id}
                    className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-100 group-hover:text-blue-300 transition">
                          {mock.title}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                          {mock.totalQuestions} Qs
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {mock.durationMinutes}m
                        </span>
                        {mock.strictSectionalTimer && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            15m/Sec
                          </span>
                        )}
                      </div>

                      {/* Subject breakdown badges */}
                      <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-400">
                        {mock.subjectCounts?.Reasoning > 0 && (
                          <span className="text-blue-300">🧠 {mock.subjectCounts.Reasoning}</span>
                        )}
                        {mock.subjectCounts?.['General Awareness'] > 0 && (
                          <span className="text-emerald-300">🌍 {mock.subjectCounts['General Awareness']}</span>
                        )}
                        {mock.subjectCounts?.['Quantitative Aptitude'] > 0 && (
                          <span className="text-amber-300">📐 {mock.subjectCounts['Quantitative Aptitude']}</span>
                        )}
                        {mock.subjectCounts?.English > 0 && (
                          <span className="text-purple-300">📖 {mock.subjectCounts.English}</span>
                        )}
                        <span className="text-slate-500">• Saved {mock.savedAt}</span>
                      </div>

                      {mock.notes && (
                        <p className="text-[11px] text-slate-400 italic">"{mock.notes}"</p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => handleLoadSavedMock(mock)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                        title="Load questions and settings into editor"
                      >
                        Load in Editor
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLaunchSavedMockDirectly(mock)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                        title="Launch and start this test immediately"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Take Test</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteSavedMock(mock.id, e)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition cursor-pointer"
                        title="Delete saved mock"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-950/40 rounded-b-2xl">
              <span>Saved mocks are preserved locally in your browser.</span>
              <button
                type="button"
                onClick={() => setShowSavedMocksDrawer(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
