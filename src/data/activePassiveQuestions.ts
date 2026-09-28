import { ActivePassiveQuestion } from './activePassiveData';
import { QUESTIONS_PART_1 } from './activePassiveQuestionsPart1';
import { QUESTIONS_PART_2 } from './activePassiveQuestionsPart2';
import { QUESTIONS_PART_3 } from './activePassiveQuestionsPart3';
import { Question } from '../types';

export const ALL_ACTIVE_PASSIVE_QUESTIONS: ActivePassiveQuestion[] = [
  ...QUESTIONS_PART_1,
  ...QUESTIONS_PART_2,
  ...QUESTIONS_PART_3,
];

// Helper to convert ActivePassiveQuestion into the standard CBT mock Question format
export function convertToCBTQuestions(customList?: ActivePassiveQuestion[]): Question[] {
  const list = customList || ALL_ACTIVE_PASSIVE_QUESTIONS;
  return list.map((q, idx) => ({
    id: 9000 + q.qNum,
    sectionId: 'english',
    sectionName: 'English Language & Comprehension',
    questionNumber: idx + 1,
    sectionQuestionNumber: idx + 1,
    text: `${q.questionText}\n[Source: ${q.source}]`,
    options: q.options.map(opt => ({
      id: opt.id,
      text: opt.text,
    })),
    correctOption: q.correctOption,
    explanation: `【Rule & Structure】: ${q.structureRule}\n\n【Key Solution】: ${q.mainExplanation}${
      q.notes ? `\n\n【Teacher Note】: ${q.notes}` : ''
    }\n\n【Option Breakdown & Traps】:\n${q.eliminations
      .map(e => `• (${e.opt.toLowerCase()}): ${e.reason}`)
      .join('\n')}`,
    subject: 'English',
    chapter: 'Active & Passive Voice',
    topic: 'Active & Passive Voice (SSC Steno 2026 Shift-Wise)',
    difficulty: q.tags.includes('Challenging') ? 'Hard' : 'Moderate',
    marks: 2.0,
    negativeMarks: 0.5,
    recommendedTimeSeconds: 30,
  }));
}
