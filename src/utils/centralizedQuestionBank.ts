import { Question, QuestionOption, SectionId } from '../types';
import { classifyQuestion, SUBJECT_TO_SECTION_ID } from './questionClassifier';
import { KNOWN_ANSWER_KEYS } from './questionParser';

export interface ParsedBankQuestion {
  id: string; // e.g. "bank-q-1"
  numericId: number;
  questionNumber: number;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  rawAnswerKey: string;
  explanation: string;
  subject: string;
  chapter: string;
  topic: string;
  subtopic: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  sectionId: SectionId;
  hasExplicitHeading?: boolean;
  isValid: boolean;
  validationIssues: string[];
  isDuplicate?: boolean;
  duplicateWithNumber?: number;
}

export interface BankParseResult {
  questions: ParsedBankQuestion[];
  stats: {
    totalDetected: number;
    validCount: number;
    needsAttentionCount: number;
    duplicateCount: number;
  };
  duplicates: Array<{ qNum1: number; qNum2: number; preview: string }>;
}

/**
 * Normalizes any subject or section label string into one of the canonical SSC CGL subjects.
 */
export function normalizeSubjectName(raw: string): 'Reasoning' | 'General Awareness' | 'Quantitative Aptitude' | 'English' | 'Computer' | null {
  if (!raw) return null;
  const clean = raw.trim().toLowerCase();
  if (/reasoning|general intelligence|intelligence|\bgi\b| तर्कशक्ति|रीजनिंग/i.test(clean)) {
    return 'Reasoning';
  }
  if (/general awareness|general knowledge|\bga\b|\bgk\b|awareness|current affairs|static gk|सामान्य ज्ञान|सामान्य जागरूकता/i.test(clean)) {
    return 'General Awareness';
  }
  if (/quantitative|quant\b|mathematics|maths?|numerical aptitude|arithmetic|अंकगणित|गणित/i.test(clean)) {
    return 'Quantitative Aptitude';
  }
  if (/english|comprehension|verbal ability|grammar|अंग्रेजी/i.test(clean)) {
    return 'English';
  }
  if (/computer|it literacy|कंप्यूटर/i.test(clean)) {
    return 'Computer';
  }
  return null;
}

export function normalizeQuestionText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Cleans and nicely formats heading text (preserves user capitalization or title-cases if all-caps).
 */
export function formatHeadingText(text: string): string {
  if (!text) return '';
  const cleaned = text.replace(/[*_#"`]/g, '').trim();
  if (!cleaned) return '';

  // If already mixed case with lowercase letters (e.g. "Letter Analogy"), preserve it
  if (/[a-z]/.test(cleaned) && /[A-Z]/.test(cleaned)) {
    return cleaned;
  }

  // If ALL CAPS (e.g. "LETTER ANALOGY" or "REASONING"), convert to Title Case
  return cleaned
    .toLowerCase()
    .split(/\s+/)
    .map((word) => {
      if (['and', 'or', 'of', 'in', 'on', 'at', 'to', 'for', 'the', 'a', 'an'].includes(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

interface ActiveHeadingState {
  subject: string;
  chapter: string;
  subtopic: string;
  hasExplicitSubtopic: boolean;
  hasExplicitHeading: boolean;
}

/**
 * Parses raw pasted questions text into a structured, validated Centralized Question Bank.
 * Supports explicit section headings:
 * SUBJECT: [Subject]
 * CHAPTER: [Chapter]
 * SUBTOPIC: [Subtopic]
 * Questions appearing below a heading inherit that Subject, Chapter, and Subtopic until a new heading appears.
 * If explicit SUBTOPIC information is present, it is NEVER overridden with automatic classification.
 */
export function parseRawTextToQuestionBank(rawText: string): BankParseResult {
  if (!rawText || !rawText.trim()) {
    return {
      questions: [],
      stats: { totalDetected: 0, validCount: 0, needsAttentionCount: 0, duplicateCount: 0 },
      duplicates: [],
    };
  }

  const cleanText = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = cleanText.split('\n');

  interface IntermediateDraft {
    extractedNum: number;
    textLines: string[];
    optionsMap: Partial<Record<'A' | 'B' | 'C' | 'D', string>>;
    currentOptionKey: 'A' | 'B' | 'C' | 'D' | null;
    rawAnswerKey: string;
    normalizedAnswer: 'A' | 'B' | 'C' | 'D' | null;
    explanationLines: string[];
    isReadingExplanation: boolean;
    inheritedHeading: ActiveHeadingState;
  }

  const drafts: IntermediateDraft[] = [];
  let currentDraft: IntermediateDraft | null = null;

  // Running state of active heading
  const activeHeading: ActiveHeadingState = {
    subject: '',
    chapter: '',
    subtopic: '',
    hasExplicitSubtopic: false,
    hasExplicitHeading: false,
  };

  const isSubjectLine = (line: string): { isMatch: boolean; value: string } => {
    const trimmed = line.trim();
    // 1. Explicit SUBJECT / SECTION / PART / SECTIONAL header
    const match = trimmed.match(/^(?:\*{1,2}|_{1,2}|#+\s*)?(?:SUBJECT|SECTION|PART|SECTIONAL)\s*(?:[A-D1-4]|\b[IVXLCDM]+\b)?\s*[:\-–]\s*(.+)$/i);
    if (match) {
      const canonical = normalizeSubjectName(match[1]);
      return { isMatch: true, value: canonical || formatHeadingText(match[1]) };
    }

    // 2. Markdown headers or standalone section labels: e.g. "# GENERAL INTELLIGENCE & REASONING" or "SECTION A: REASONING" or "PART-1 : QUANTITATIVE APTITUDE"
    const standaloneMatch = trimmed.match(/^(?:\*{1,2}|_{1,2}|#+\s*)?(?:(?:SECTION|PART)\s*(?:[-–:]?\s*[A-D1-4]\b)?\s*[:\-–]?\s*)?([A-Za-z\s&,–\-]{4,50})$/i);
    if (standaloneMatch) {
      const canonical = normalizeSubjectName(standaloneMatch[1]);
      if (canonical) {
        return { isMatch: true, value: canonical };
      }
    }

    return { isMatch: false, value: '' };
  };

  const isChapterLine = (line: string): { isMatch: boolean; value: string } => {
    const trimmed = line.trim();
    const match = trimmed.match(/^(?:\*{1,2}|_{1,2}|#+\s*)?(?:CHAPTER|TOPIC)\s*[:\-–]\s*(.+)$/i);
    if (!match) return { isMatch: false, value: '' };
    return { isMatch: true, value: formatHeadingText(match[1]) };
  };

  const isSubtopicLine = (line: string): { isMatch: boolean; value: string } => {
    const trimmed = line.trim();
    const match = trimmed.match(/^(?:\*{1,2}|_{1,2}|#+\s*)?(?:SUBTOPIC|SUB-TOPIC|SUB\s+TOPIC)\s*[:\-–]\s*(.+)$/i);
    if (!match) return { isMatch: false, value: '' };
    return { isMatch: true, value: formatHeadingText(match[1]) };
  };

  const isQuestionHeader = (line: string): { isHeader: boolean; num: number; textAfter: string } => {
    const trimmed = line.trim();
    if (!trimmed) return { isHeader: false, num: 0, textAfter: '' };

    // Ignore heading lines as questions
    if (/^(?:\*{1,2}|_{1,2}|#+\s*)?(?:SUBJECT|CHAPTER|TOPIC|SUBTOPIC|SUB-TOPIC|SUB\s+TOPIC)\s*[:\-–]/i.test(trimmed)) {
      return { isHeader: false, num: 0, textAfter: '' };
    }

    // Disqualify if it's an option line like "A) ...", "A. ...", "(A) ...", "Option A:", "1) ...", etc.
    if (/^(?:\*{1,2}|_{1,2})?(?:Option\s+[A-D1-4]|[A-Da-d][).:\-–]|\([A-Da-d1-4]\))/i.test(trimmed)) {
      return { isHeader: false, num: 0, textAfter: '' };
    }

    // Disqualify if it's an answer or explanation line
    if (
      /^(?:\*{1,2})?(?:(?:Correct\s*)?Ans(?:wer)?(?: key)?|Correct Option|Key|उत्तर|Explanation|Explain|Solution|Sol|Hint|Notes|व्याख्या|हल)[:\-–\s]/i.test(
        trimmed
      )
    ) {
      return { isHeader: false, num: 0, textAfter: '' };
    }

    // Pattern 1: Explicit Q marker
    // e.g., Q1., Q1), Q.1, Question 1:, **Q1.**, **Question 1**, Que 1., Prashna 1:
    const explicitQMatch = trimmed.match(
      /^(?:\*{1,2}|_{1,2})?(?:Q(?:uestion)?|Que|Ques|Prashna)\.?\s*(\d{1,4})(?:[.:)\-–]|\*{1,2}|_{1,2}|\s+)*(.*)$/i
    );

    if (explicitQMatch) {
      const num = parseInt(explicitQMatch[1], 10);
      const textAfter = explicitQMatch[2].replace(/^[*_.:)\-–\s]+/, '').trim();
      return { isHeader: true, num, textAfter };
    }

    // Pattern 2: Bold markdown number header: **1.** or **1)** or **1:** or **1**
    const boldNumMatch = trimmed.match(
      /^\*{2}(\d{1,4})(?:[.:)\-–])?\*{2}\s*(.*)$/
    );
    if (boldNumMatch) {
      const num = parseInt(boldNumMatch[1], 10);
      const textAfter = boldNumMatch[2].trim();
      const prevDraftFinished =
        currentDraft && (Object.keys(currentDraft.optionsMap).length >= 2 || !!currentDraft.rawAnswerKey);
      if (!currentDraft || prevDraftFinished) {
        return { isHeader: true, num, textAfter };
      }
    }

    // Pattern 3: Bare number with MANDATORY delimiter: e.g. "1. ", "1) ", "1: ", "1 - "
    // Delimiter (. or ) or : or -) followed by whitespace is REQUIRED.
    // Numbers in tables, matrices, or formulas like "6   8   48" will NEVER match because "6" is not followed by a delimiter!
    const bareNumMatch = trimmed.match(
      /^(\d{1,4})([.)\-–:])\s+(.*)$/
    );

    if (bareNumMatch) {
      const num = parseInt(bareNumMatch[1], 10);
      const textAfter = bareNumMatch[3].trim();

      // Only allow a bare number to start a question if:
      // a) No draft started yet (first question in document), OR
      // b) The previous draft is already finished (has collected options or answer).
      // This prevents numbered list items or numbered statements inside question bodies from breaking questions.
      const prevDraftFinished =
        currentDraft && (Object.keys(currentDraft.optionsMap).length >= 2 || !!currentDraft.rawAnswerKey);

      if (!currentDraft || prevDraftFinished) {
        return { isHeader: true, num, textAfter };
      }
    }

    return { isHeader: false, num: 0, textAfter: '' };
  };

  const isOptionLine = (line: string): { isOption: boolean; optId: 'A' | 'B' | 'C' | 'D' | null; text: string } => {
    const trimmed = line.trim();
    // 1. Letters: A), A., (A), Option A:, **A)**, **A.**, A -
    const letterMatch = trimmed.match(
      /^(?:\*{1,2}|_{1,2})?(?:Option\s+)?(?:\(([A-Da-d])\)|([A-Da-d])\s*[).:\-–])(?:\*{1,2}|_{1,2})?\s*(.*)$/
    );
    if (letterMatch) {
      const optLetter = (letterMatch[1] || letterMatch[2]).toUpperCase() as 'A' | 'B' | 'C' | 'D';
      return { isOption: true, optId: optLetter, text: letterMatch[3].trim() };
    }

    // 2. Numbers in options context: (1), (2), Option 1:, or 1)
    const numMatch = trimmed.match(
      /^(?:\*{1,2}|_{1,2})?(?:Option\s+([1-4])[:.\-–]?|\(([1-4])\)|([1-4])\s*\))(?:\*{1,2}|_{1,2})?\s*(.*)$/
    );
    if (numMatch) {
      const num = numMatch[1] || numMatch[2] || numMatch[3];
      const map: Record<string, 'A' | 'B' | 'C' | 'D'> = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
      return { isOption: true, optId: map[num] || null, text: numMatch[4].trim() };
    }

    return { isOption: false, optId: null, text: '' };
  };

  const isAnswerLine = (line: string): { isAnswer: boolean; rawAnswer: string; normalized: 'A' | 'B' | 'C' | 'D' | null } => {
    const trimmed = line.trim();
    // Handles: Answer: A, Answer: A), Answer: B., Correct Answer: C, Ans: D, उत्तर: A, Key: B
    const match = trimmed.match(
      /^(?:\*{1,2})?(?:(?:Correct\s*)?Ans(?:wer)?(?: key)?|Correct Option|Key|उत्तर)[:\-–\s]+(?:\*{1,2})?([A-Za-z0-9)(]+)/i
    );
    if (!match) return { isAnswer: false, rawAnswer: '', normalized: null };

    const raw = match[1].replace(/[*_()[\]:.\-]/g, '').trim().toUpperCase();
    let norm: 'A' | 'B' | 'C' | 'D' | null = null;
    if (raw === 'A' || raw === '1') norm = 'A';
    else if (raw === 'B' || raw === '2') norm = 'B';
    else if (raw === 'C' || raw === '3') norm = 'C';
    else if (raw === 'D' || raw === '4') norm = 'D';

    return { isAnswer: true, rawAnswer: raw, normalized: norm };
  };

  const isExplanationLine = (line: string): { isExp: boolean; text: string } => {
    const trimmed = line.trim();
    const match = trimmed.match(/^(?:\*{1,2})?(?:Explanation|Explain|Solution|Sol|Hint|Notes|व्याख्या|हल)[:\-–\s]+(?:\*{1,2})?(.*)$/i);
    if (!match) return { isExp: false, text: '' };
    return { isExp: true, text: match[1].trim() };
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) continue;

    // A. Check for SUBJECT: heading
    const subjectMatch = isSubjectLine(trimmed);
    if (subjectMatch.isMatch) {
      if (currentDraft) {
        drafts.push(currentDraft);
        currentDraft = null;
      }
      activeHeading.subject = subjectMatch.value;
      activeHeading.hasExplicitHeading = true;
      continue;
    }

    // B. Check for CHAPTER: or TOPIC: heading
    const chapterMatch = isChapterLine(trimmed);
    if (chapterMatch.isMatch) {
      if (currentDraft) {
        drafts.push(currentDraft);
        currentDraft = null;
      }
      activeHeading.chapter = chapterMatch.value;
      activeHeading.hasExplicitHeading = true;
      continue;
    }

    // C. Check for SUBTOPIC: heading
    const subtopicMatch = isSubtopicLine(trimmed);
    if (subtopicMatch.isMatch) {
      if (currentDraft) {
        drafts.push(currentDraft);
        currentDraft = null;
      }
      activeHeading.subtopic = subtopicMatch.value;
      activeHeading.hasExplicitSubtopic = true;
      activeHeading.hasExplicitHeading = true;
      continue;
    }

    // 1. Check if line starts a new question
    const qHeader = isQuestionHeader(trimmed);
    if (qHeader.isHeader) {
      if (currentDraft) {
        drafts.push(currentDraft);
      }
      currentDraft = {
        extractedNum: qHeader.num,
        textLines: qHeader.textAfter ? [qHeader.textAfter] : [],
        optionsMap: {},
        currentOptionKey: null,
        rawAnswerKey: '',
        normalizedAnswer: null,
        explanationLines: [],
        isReadingExplanation: false,
        inheritedHeading: { ...activeHeading },
      };
      continue;
    }

    if (!currentDraft) {
      // Preamble line before first question
      continue;
    }

    // 2. Check for Explanation
    const expCheck = isExplanationLine(trimmed);
    if (expCheck.isExp) {
      currentDraft.isReadingExplanation = true;
      currentDraft.currentOptionKey = null;
      if (expCheck.text) {
        currentDraft.explanationLines.push(expCheck.text);
      }
      continue;
    }

    if (currentDraft.isReadingExplanation) {
      if (trimmed) {
        currentDraft.explanationLines.push(rawLine);
      }
      continue;
    }

    // 3. Check for Answer Line
    const ansCheck = isAnswerLine(trimmed);
    if (ansCheck.isAnswer) {
      currentDraft.rawAnswerKey = ansCheck.rawAnswer;
      currentDraft.normalizedAnswer = ansCheck.normalized;
      currentDraft.currentOptionKey = null;
      continue;
    }

    // 4. Check for Option Line (A, B, C, D)
    const optCheck = isOptionLine(trimmed);
    if (optCheck.isOption && optCheck.optId) {
      currentDraft.currentOptionKey = optCheck.optId;
      currentDraft.optionsMap[optCheck.optId] = optCheck.text;
      continue;
    }

    // 5. Continuation lines
    if (currentDraft.currentOptionKey && !currentDraft.rawAnswerKey) {
      // Continuation of current option text
      if (trimmed) {
        const existing = currentDraft.optionsMap[currentDraft.currentOptionKey] || '';
        currentDraft.optionsMap[currentDraft.currentOptionKey] = existing ? `${existing} ${trimmed}` : trimmed;
      }
    } else if (!currentDraft.currentOptionKey && !currentDraft.rawAnswerKey) {
      // Continuation of question text before options
      if (trimmed) {
        currentDraft.textLines.push(rawLine);
      }
    }
  }

  if (currentDraft) {
    drafts.push(currentDraft);
  }

  // Convert intermediate drafts to full ParsedBankQuestion objects
  const parsedBank: ParsedBankQuestion[] = [];

  drafts.forEach((draft, idx) => {
    const qNum = draft.extractedNum || idx + 1;
    const questionText = draft.textLines.join('\n').trim();

    const options = {
      A: (draft.optionsMap['A'] || '').trim(),
      B: (draft.optionsMap['B'] || '').trim(),
      C: (draft.optionsMap['C'] || '').trim(),
      D: (draft.optionsMap['D'] || '').trim(),
    };

    let correctAnswer = draft.normalizedAnswer;
    let explanation = draft.explanationLines.join('\n').trim();

    // Fallback to known standard keys if missing
    if (!correctAnswer && KNOWN_ANSWER_KEYS[qNum]) {
      correctAnswer = KNOWN_ANSWER_KEYS[qNum].correct;
      if (!explanation) {
        explanation = KNOWN_ANSWER_KEYS[qNum].exp;
      }
    }

    // Auto-classification candidate
    const classification = classifyQuestion(questionText, options, explanation);

    // CRITICAL USER RULE:
    // If explicit SUBTOPIC information is present, DO NOT override it with automatic AI classification!
    // Use automatic classification only when SUBTOPIC is missing.
    const inherited = draft.inheritedHeading;
    const hasExplicitSubtopic = Boolean(
      inherited && inherited.hasExplicitSubtopic && inherited.subtopic && inherited.subtopic.trim()
    );

    let finalSubject: string;
    let finalChapter: string;
    let finalSubtopic: string;
    let finalSectionId: SectionId;

    if (hasExplicitSubtopic) {
      // Respect explicit heading metadata strictly!
      finalSubject = inherited.subject || classification.subject;
      finalChapter = inherited.chapter || inherited.subtopic || classification.topic;
      finalSubtopic = inherited.subtopic;
      finalSectionId = SUBJECT_TO_SECTION_ID[finalSubject] || classification.sectionId || 'reasoning';
    } else {
      // Subtopic is missing -> Use automatic classification
      finalSubject = inherited.subject || classification.subject;
      finalChapter = inherited.chapter || classification.topic;
      finalSubtopic = classification.subtopic;
      finalSectionId = SUBJECT_TO_SECTION_ID[finalSubject] || classification.sectionId || 'reasoning';
    }

    // Validation checks
    const validationIssues: string[] = [];

    if (!questionText) {
      validationIssues.push('Question text is empty');
    }

    if (!options.A) validationIssues.push('Missing option A');
    if (!options.B) validationIssues.push('Missing option B');
    if (!options.C) validationIssues.push('Missing option C');
    if (!options.D) validationIssues.push('Missing option D');

    if (!correctAnswer) {
      if (draft.rawAnswerKey) {
        validationIssues.push(`Answer key "${draft.rawAnswerKey}" does not match available options A-D`);
      } else {
        validationIssues.push('Missing answer key (e.g. Answer: A)');
      }
    }

    const isValid = validationIssues.length === 0;

    parsedBank.push({
      id: `bank-q-${idx + 1}`,
      numericId: 9100 + idx + 1,
      questionNumber: qNum,
      text: questionText || `Question ${qNum}`,
      options: {
        A: options.A || 'Option A',
        B: options.B || 'Option B',
        C: options.C || 'Option C',
        D: options.D || 'Option D',
      },
      correctAnswer: correctAnswer || 'A',
      rawAnswerKey: draft.rawAnswerKey || (correctAnswer ? String(correctAnswer) : ''),
      explanation: explanation,
      subject: finalSubject,
      chapter: finalChapter,
      topic: finalChapter,
      subtopic: finalSubtopic,
      difficulty: classification.difficulty,
      sectionId: finalSectionId,
      hasExplicitHeading: hasExplicitSubtopic || inherited.hasExplicitHeading,
      isValid,
      validationIssues,
    });
  });

  // Duplicate Detection: check pairs for identical or near-identical text
  const duplicatePairs: Array<{ qNum1: number; qNum2: number; preview: string }> = [];
  const normalizedTexts = parsedBank.map((q) => normalizeQuestionText(q.text));

  for (let i = 0; i < parsedBank.length; i++) {
    const textI = normalizedTexts[i];
    if (textI.length < 15) continue; // skip trivial short strings

    for (let j = i + 1; j < parsedBank.length; j++) {
      const textJ = normalizedTexts[j];
      if (textJ.length < 15) continue;

      let isDup = false;
      if (textI === textJ) {
        isDup = true;
      } else if (textI.length > 25 && textJ.length > 25) {
        // Check prefix or high overlap
        if (textI.startsWith(textJ.slice(0, 40)) || textJ.startsWith(textI.slice(0, 40))) {
          isDup = true;
        }
      }

      if (isDup) {
        parsedBank[j].isDuplicate = true;
        parsedBank[j].duplicateWithNumber = parsedBank[i].questionNumber;
        duplicatePairs.push({
          qNum1: parsedBank[i].questionNumber,
          qNum2: parsedBank[j].questionNumber,
          preview: parsedBank[j].text.slice(0, 60),
        });
      }
    }
  }

  const validCount = parsedBank.filter((q) => q.isValid).length;
  const needsAttentionCount = parsedBank.length - validCount;
  const duplicateCount = duplicatePairs.length;

  return {
    questions: parsedBank,
    stats: {
      totalDetected: parsedBank.length,
      validCount,
      needsAttentionCount,
      duplicateCount,
    },
    duplicates: duplicatePairs,
  };
}

/**
 * Reclassifies a question using AI auto-classification (when user explicitly requests "AI Reclassify").
 */
export function reclassifyBankQuestion(q: ParsedBankQuestion): ParsedBankQuestion {
  const classification = classifyQuestion(q.text, q.options, q.explanation);
  return {
    ...q,
    subject: classification.subject,
    chapter: classification.topic,
    topic: classification.topic,
    subtopic: classification.subtopic,
    difficulty: classification.difficulty,
    sectionId: classification.sectionId,
    hasExplicitHeading: false,
  };
}

/**
 * Detects each question's subject:
 * - 'ai_content': runs deep content classifier on every single question to determine Subject, Chapter, Subtopic, and SectionId
 * - 'ssc_100_split': distributes questions across the 4 canonical SSC CGL sections (Q1-25 Reasoning, Q26-50 GA, Q51-75 Quant, Q76-100 English)
 */
export function detectSubjectForBankQuestions(
  bankQuestions: ParsedBankQuestion[],
  mode: 'ai_content' | 'ssc_100_split' = 'ai_content'
): ParsedBankQuestion[] {
  if (mode === 'ssc_100_split') {
    const total = bankQuestions.length;
    // Calculate 4 balanced quarters
    const q1End = Math.round(total * 0.25);
    const q2End = Math.round(total * 0.5);
    const q3End = Math.round(total * 0.75);

    return bankQuestions.map((q, idx) => {
      let subj: 'Reasoning' | 'General Awareness' | 'Quantitative Aptitude' | 'English';
      let secId: SectionId;

      if (idx < q1End) {
        subj = 'Reasoning';
        secId = 'reasoning';
      } else if (idx < q2End) {
        subj = 'General Awareness';
        secId = 'general_awareness';
      } else if (idx < q3End) {
        subj = 'Quantitative Aptitude';
        secId = 'quant';
      } else {
        subj = 'English';
        secId = 'english';
      }

      // If already has consistent classification within that subject, preserve; else reclassify
      const classification = classifyQuestion(q.text, q.options, q.explanation);
      const finalTopic = classification.subject === subj ? classification.topic : (q.chapter || 'General Practice');
      const finalSubtopic = classification.subject === subj ? classification.subtopic : (q.subtopic || 'Mixed Section Drill');

      return {
        ...q,
        subject: subj,
        sectionId: secId,
        chapter: finalTopic,
        topic: finalTopic,
        subtopic: finalSubtopic,
      };
    });
  }

  // 'ai_content' mode: detect each question individually using deep content classifier
  return bankQuestions.map((q) => reclassifyBankQuestion(q));
}

/**
 * Converts centralized bank questions into standard interactive Question objects for the test engine.
 * Supports by_section ordering for official 4-subject SSC CGL mocks with per-section numbering (1..25).
 */
export function bankQuestionsToExamQuestions(
  bankQuestions: ParsedBankQuestion[],
  orderMode: 'original' | 'random' | 'by_section' | boolean = 'original'
): Question[] {
  let list: ParsedBankQuestion[];
  if (typeof orderMode === 'boolean') {
    list = orderMode ? [...bankQuestions] : [...bankQuestions].sort(() => Math.random() - 0.5);
  } else if (orderMode === 'random') {
    list = [...bankQuestions].sort(() => Math.random() - 0.5);
  } else if (orderMode === 'by_section') {
    // Group questions by the 4 standard SSC CGL sections: reasoning -> general_awareness -> quant -> english
    const buckets: Record<string, ParsedBankQuestion[]> = {
      reasoning: [],
      general_awareness: [],
      quant: [],
      english: [],
      other: [],
    };

    bankQuestions.forEach((bq) => {
      const secId = bq.sectionId || SUBJECT_TO_SECTION_ID[bq.subject] || 'reasoning';
      if (buckets[secId]) {
        buckets[secId].push(bq);
      } else {
        buckets.other.push(bq);
      }
    });

    list = [
      ...buckets.reasoning,
      ...buckets.general_awareness,
      ...buckets.quant,
      ...buckets.english,
      ...buckets.other,
    ];
  } else {
    list = [...bankQuestions];
  }

  const sectionNameMap: Record<SectionId, string> = {
    reasoning: 'General Intelligence & Reasoning',
    general_awareness: 'General Awareness',
    quant: 'Quantitative Aptitude',
    english: 'English Comprehension',
  };

  // Section-wise question numbering counters
  const sectionCounters: Record<string, number> = {};

  return list.map((bq, idx) => {
    const secId = bq.sectionId || SUBJECT_TO_SECTION_ID[bq.subject] || 'reasoning';
    sectionCounters[secId] = (sectionCounters[secId] || 0) + 1;

    const options: QuestionOption[] = [
      { id: 'A', text: bq.options.A },
      { id: 'B', text: bq.options.B },
      { id: 'C', text: bq.options.C },
      { id: 'D', text: bq.options.D },
    ];

    const chapterOrTopic = bq.chapter || bq.topic || 'General';

    return {
      id: bq.numericId || 9100 + idx + 1,
      sectionId: secId,
      sectionName: sectionNameMap[secId] || bq.subject || 'Section',
      questionNumber: idx + 1,
      sectionQuestionNumber: sectionCounters[secId],
      text: bq.text,
      options,
      correctOption: bq.correctAnswer,
      explanation: bq.explanation ? bq.explanation : 'Explanation not provided.',
      subject: bq.subject,
      chapter: chapterOrTopic,
      topic: chapterOrTopic,
      subtopic: bq.subtopic,
      difficulty: bq.difficulty,
      marks: 2.0,
      negativeMarks: 0.5,
      recommendedTimeSeconds: 45,
    };
  });
}
