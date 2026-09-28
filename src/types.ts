export type SectionId = 'reasoning' | 'general_awareness' | 'quant' | 'english';

export type QuestionStatus =
  | 'not_visited'
  | 'not_answered'
  | 'answered'
  | 'marked_for_review'
  | 'answered_and_marked';

export type ExamTheme = 'cbt_master' | 'testbook' | 'tcs' | 'dark';
export type FontSize = 'normal' | 'large' | 'xlarge';
export type ExamLanguage = 'en' | 'hi';

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  textHindi?: string;
}

export interface Question {
  id: number;
  sectionId: SectionId;
  sectionName: string;
  questionNumber: number; // 1 to 100
  sectionQuestionNumber: number; // 1 to 25
  text: string;
  textHindi?: string;
  subText?: string;
  passage?: string;
  passageHindi?: string;
  options: QuestionOption[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  explanationHindi?: string;
  subject?: string;
  chapter?: string;
  topic: string;
  subtopic?: string;
  difficulty: 'Standard' | 'Moderate' | 'Tricky' | 'Easy' | 'Hard';
  marks: number;
  negativeMarks: number;
  recommendedTimeSeconds?: number;
}

export interface UserResponse {
  questionId: number;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  status: QuestionStatus;
  timeSpentSeconds: number;
}

export interface SectionSummary {
  sectionId: SectionId;
  sectionName: string;
  targetRange: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  markedForReview: number;
  score: number;
  maxScore: number;
  accuracy: number;
  timeSpentSeconds: number;
}

export interface AttemptRecord {
  id: string;
  attemptNumber: number;
  timestamp: string;
  mode: 'full' | 'incorrect_and_skipped';
  totalQuestions: number;
  score: number;
  maxScore: number;
  accuracy: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  timeSpentSeconds: number;
  responses: Record<number, UserResponse>;
  sectionBreakdown: Record<
    SectionId,
    { score: number; correct: number; incorrect: number; attempted: number; total: number }
  >;
}

export interface ExamResult {
  totalScore: number;
  maxScore: number;
  totalAttempted: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalUnattempted: number;
  overallAccuracy: number;
  totalTimeSpentSeconds: number;
  sections: Record<SectionId, SectionSummary>;
  submittedAt: string;
}

export interface SavedCustomMock {
  id: string;
  title: string;
  savedAt: string;
  rawText: string;
  durationMinutes: number;
  strictSectionalTimer: boolean;
  orderMode: 'by_section' | 'original' | 'random';
  totalQuestions: number;
  subjectCounts: Record<string, number>;
  notes?: string;
}

