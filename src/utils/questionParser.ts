import { Question, QuestionOption, SectionId } from '../types';

export interface ParseResult {
  questions: Question[];
  stats: {
    totalParsed: number;
    withFourOptions: number;
    withExplicitAnswer: number;
    withExplanation: number;
  };
  errors: string[];
}

export const SAMPLE_REASONING_TEXT = `Q1. Select the option that is related to the third letter-cluster in the same way as the second letter-cluster is related to the first letter-cluster:
TRACK : UTDGP :: GLOBE : ?
A) HNWFI
B) HMRFI
C) HNVFH
D) HNVEH
Answer: A
Explanation: Pattern: +1, +2, +3, +4, +5. G(+1)=H, L(+2)=N, O(+3)=R, B(+4)=F, E(+5)=J. Correct mapped option is HNWFI.

Q2. Three of the following four number-pairs are alike in a certain way and one is different. Find the odd one out:
A) 14 : 197
B) 16 : 257
C) 18 : 325
D) 12 : 145
Answer: C
Explanation: Pattern: n : n² + 1. 14² + 1 = 197; 16² + 1 = 257; 12² + 1 = 145. But 18² + 1 = 325.

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

Q4. If 'A + B' means 'A is the father of B', 'A - B' means 'A is the sister of B', and 'A × B' means 'A is the brother of B', which of the following means 'P is the aunt of Q'?
A) P - R + Q
B) P + R - Q
C) P × R + Q
D) P - R × Q
Answer: A
Explanation: P - R means P is the sister of R. R + Q means R is the father of Q. Sister of father is paternal aunt.

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

export const SAMPLE_GA_TEXT = `Q1. Which Article of the Indian Constitution empowers the High Courts to issue writs for the enforcement of Fundamental Rights?
A) Article 32
B) Article 131
C) Article 226
D) Article 143
Answer: C
Explanation: Article 226 empowers High Courts to issue writs including habeas corpus, mandamus, prohibition, quo warranto and certiorari.

Q2. The famous battle of Plassey was fought in which year?
A) 1757
B) 1764
C) 1761
D) 1773
Answer: A
Explanation: The Battle of Plassey was fought on 23 June 1757 between Siraj-ud-Daulah and the British East India Company led by Robert Clive.

Q3. Which of the following is an example of an indirect tax in India?
A) Income Tax
B) Corporation Tax
C) Goods and Services Tax (GST)
D) Capital Gains Tax
Answer: C
Explanation: GST is an indirect tax levied on the supply of goods and services.

Q4. Which planet in our solar system is known as the 'Red Planet'?
A) Venus
B) Mars
C) Jupiter
D) Mercury
Answer: B
Explanation: Mars appears reddish due to the prevalence of iron oxide on its surface.

Q5. Who was awarded the Nobel Prize in Physics in 1930 for the discovery of the Raman Effect?
A) Homi J. Bhabha
B) C. V. Raman
C) Jagadish Chandra Bose
D) Meghnad Saha
Answer: B
Explanation: Sir C. V. Raman received the 1930 Nobel Prize in Physics for his work on the scattering of light.`;

export const SAMPLE_QUANT_TEXT = `Q1. A shopkeeper marks his goods at 30% above the cost price and allows a discount of 15% on the marked price. What is his net profit percentage?
A) 10.5%
B) 12.0%
C) 15.0%
D) 8.5%
Answer: A
Explanation: Let CP = 100. MP = 130. Discount = 15% of 130 = 19.5. SP = 130 - 19.5 = 110.5. Profit% = 10.5%.

Q2. A train 240 m long crosses a platform of equal length in 24 seconds. What is the speed of the train in km/h?
A) 60 km/h
B) 72 km/h
C) 54 km/h
D) 80 km/h
Answer: B
Explanation: Total distance = 240 + 240 = 480 m. Speed = 480 / 24 = 20 m/s = 20 × (18/5) = 72 km/h.

Q3. If A : B = 3 : 4 and B : C = 8 : 9, then what is the ratio of A : C?
A) 1 : 2
B) 2 : 3
C) 3 : 2
D) 4 : 3
Answer: B
Explanation: A/C = (A/B) × (B/C) = (3/4) × (8/9) = 24/36 = 2/3.

Q4. A can complete a piece of work in 12 days and B can do it in 18 days. If they work together for 4 days, what fraction of work is left?
A) 4/9
B) 5/9
C) 1/3
D) 2/3
Answer: A
Explanation: 1 day work = 1/12 + 1/18 = 5/36. 4 days work = 4 × (5/36) = 20/36 = 5/9. Work left = 1 - 5/9 = 4/9.

Q5. If x + 1/x = 5, then find the value of x² + 1/x²:
A) 23
B) 25
C) 27
D) 21
Answer: A
Explanation: x² + 1/x² = (x + 1/x)² - 2 = 5² - 2 = 25 - 2 = 23.`;

export const SAMPLE_ENGLISH_TEXT = `Q1. Select the most appropriate synonym of the given word: 'METICULOUS'
A) Careless
B) Painstaking
C) Hasty
D) Slovenly
Answer: B
Explanation: 'Meticulous' means showing great attention to detail; very careful and precise. 'Painstaking' is the closest synonym.

Q2. Select the option that rectifies the grammatical error in the underlined segment:
Neither of the two candidates who applied for the manager post <were selected>.
A) was selected
B) have been selected
C) are selected
D) were being selected
Answer: A
Explanation: 'Neither of' takes a singular verb. Hence, 'was selected' is the correct form.

Q3. Select the most appropriate meaning of the idiom: 'To bite the bullet'
A) To suffer an unexpected accident
B) To face a difficult or unpleasant situation with courage
C) To speak harsh words in anger
D) To avoid responsibilities
Answer: B
Explanation: 'To bite the bullet' means to face a grim situation with bravery and fortitude.

Q4. Select the correct one-word substitute for the phrase: 'A person who is indifferent to pain or pleasure'
A) Stoic
B) Cynic
C) Epicure
D) Hedonist
Answer: A
Explanation: A 'Stoic' is a person who can endure pain or hardship without showing feelings or complaining.

Q5. Select the correctly spelt word:
A) Accomodation
B) Accommodation
C) Acommodation
D) Accomadation
Answer: B
Explanation: The correct spelling is 'Accommodation' with double 'c' and double 'm'.`;

export const SAMPLE_QUESTIONS_TEXT = SAMPLE_REASONING_TEXT;

export const SECTION_SAMPLES: Record<SectionId, string> = {
  reasoning: SAMPLE_REASONING_TEXT,
  general_awareness: SAMPLE_GA_TEXT,
  quant: SAMPLE_QUANT_TEXT,
  english: SAMPLE_ENGLISH_TEXT,
};

// Built-in verified answer keys and explanations for standard SSC CGL Tier-1 100-Question Mock Drill
export const KNOWN_ANSWER_KEYS: Record<number, { correct: 'A' | 'B' | 'C' | 'D'; exp: string }> = {
  1: { correct: 'C', exp: 'Series pattern: ×2 + 1. 5×2+1=11, 11×2+1=23, 23×2+1=47, 47×2+1=95, 95×2+1=191.' },
  2: { correct: 'A', exp: 'MANGO → NBOHP (+1 for each letter). APPLE: A+1=B, P+1=Q, P+1=Q, L+1=M, E+1=F → BQQMF.' },
  3: { correct: 'D', exp: '121 (11²), 169 (13²), 225 (15²) are squares of odd numbers. 256 (16²) is the square of an even number (16²).' },
  4: { correct: 'B', exp: 'C = 3, G = 7, L = 12. Sum = 3 + 7 + 12 = 22.' },
  5: { correct: 'A', exp: '10 m South, turn left (East) 8 m, turn left (North) 10 m cancels out the South movement. He is 8 m East of starting point.' },
  6: { correct: 'C', exp: 'From "All pens are books" and "No paper is a pen", some books that are papers are not pens (I follows). "Some books are papers" implies "Some papers are books" (II follows).' },
  7: { correct: 'A', exp: 'First letters: A(+2) → C(+2) → E(+2) → G(+2) → I. Second letters: Z(-2) → X(-2) → V(-2) → T(-2) → R. Hence, IR.' },
  8: { correct: 'B', exp: '"Mother\'s only daughter" is Riya herself. The son of Riya is her son.' },
  9: { correct: 'C', exp: 'Original: 12 + 3 − 5 × 4. Substituting operators (+ → ×, − → +, × → −): 12 × 3 + 5 − 4 = 36 + 5 − 4 = 37.' },
  10: { correct: 'A', exp: 'With T at the extreme left, P at 3, R at 4, and U not adjacent to Q, seating arrangement places Q at the extreme right.' },
  11: { correct: 'C', exp: '2×2+1=5, 5×2+1=11, 11×2+1=23, 23×2+1=47, 47×2+1=95.' },
  12: { correct: 'B', exp: 'Teachers and doctors overlap (e.g. medical college professors), and women intersects both categories.' },
  13: { correct: 'A', exp: '64 is both a square (8²) and a cube (4³), unlike the other numbers.' },
  14: { correct: 'A', exp: 'Pattern is +1 for each letter: C→D, H→I, A→B, I→J, R→S → DIBJS.' },
  15: { correct: 'C', exp: 'Order of heights: E > C > A > B > D. The second tallest person is C.' },
  16: { correct: 'C', exp: 'Pattern: n : n(n+1). 8 × 9 = 72; 11 × 12 = 132.' },
  17: { correct: 'D', exp: 'MASTER requires the letter "E", which does not appear in ADMINISTRATION.' },
  18: { correct: 'A', exp: 'Some cars are buses and all buses are vehicles implies Some cars are vehicles (I follows). Conclusion II does not follow.' },
  19: { correct: 'D', exp: 'C(3) +3 → F(6) +5 → K(11) +7 → R(18) +9 → 27 = A (mod 26).' },
  20: { correct: 'B', exp: 'At 3:00, the minute hand points to 12 and the hour hand to 3. Angle = 3 × 30° = 90°.' },
  21: { correct: 'A', exp: 'Swapping pairs in MOBILE: (M,O)→OM, (B,I)→IB, (L,E)→EL = OMIBEL.' },
  22: { correct: 'C', exp: 'Differences: +3, +6, +12, +24, +48. 52 + 48 = 100.' },
  23: { correct: 'B', exp: 'Total students = Top rank + Bottom rank − 1 = 15 + 18 − 1 = 32.' },
  24: { correct: 'B', exp: 'Given P > Q = R < S < T. Since R < T, it is definitely true that T > R.' },
  25: { correct: 'A', exp: '8 : 64 has 8 as a cube (2³), unlike 9, 11, 12.' },
  // GA (26-50)
  26: { correct: 'B', exp: 'Article 324 provides for the Election Commission of India.' },
  27: { correct: 'B', exp: 'The minimum age required to become a member of Lok Sabha is 25 years.' },
  28: { correct: 'C', exp: 'The 61st Constitutional Amendment Act, 1988 lowered the voting age from 21 to 18 years.' },
  29: { correct: 'B', exp: 'The Fourth Schedule of the Constitution deals with allocation of seats in Rajya Sabha.' },
  30: { correct: 'B', exp: 'The Directive Principles of State Policy were inspired by the Constitution of Ireland.' },
  31: { correct: 'D', exp: 'Rice is a Kharif crop sown with monsoon rains. Wheat, mustard, and gram are Rabi crops.' },
  32: { correct: 'A', exp: 'Black soil (Regur soil) has high water retention and is ideal for cotton.' },
  33: { correct: 'A', exp: 'The Narmada River originates from the Amarkantak plateau in Madhya Pradesh.' },
  34: { correct: 'B', exp: 'Wular Lake in Jammu & Kashmir is the largest freshwater lake in India by surface area.' },
  35: { correct: 'B', exp: 'Swami Dayanand Saraswati established the Arya Samaj in 1875.' },
  36: { correct: 'C', exp: 'The Revolt of 1857 began on 10 May 1857 at Meerut.' },
  37: { correct: 'B', exp: 'The Simon Commission arrived in India in February 1928.' },
  38: { correct: 'B', exp: 'Mahatma Gandhi gave the slogan "Do or Die" during the Quit India Movement in 1942.' },
  39: { correct: 'B', exp: 'Mercury (Hg) is the only metallic element that is liquid at standard room temperature.' },
  40: { correct: 'C', exp: 'A neutral aqueous solution has a pH of 7 at 25°C.' },
  41: { correct: 'B', exp: 'Deficiency of Vitamin C (ascorbic acid) causes scurvy.' },
  42: { correct: 'D', exp: 'O-negative (O−) blood lacks A, B, and Rh antigens, making it the universal RBC donor.' },
  43: { correct: 'B', exp: 'The kidneys filter blood and remove nitrogenous metabolic wastes to form urine.' },
  44: { correct: 'B', exp: 'The Monetary Policy Committee of the Reserve Bank of India (RBI) decides the repo rate.' },
  45: { correct: 'B', exp: 'GST is a comprehensive, destination-based indirect tax.' },
  46: { correct: 'B', exp: 'NITI Aayog replaced the Planning Commission on 1 January 2015.' },
  47: { correct: 'D', exp: 'All three statements are correct: SpaDeX (Space Docking), NISAR (Earth Observation), NavIC (Regional Navigation).' },
  48: { correct: 'A', exp: 'Sattriya is the classical dance form of Assam, founded by Srimanta Sankardev.' },
  49: { correct: 'C', exp: 'The International Monetary Fund (IMF) headquarters is located in Washington, D.C., USA.' },
  50: { correct: 'C', exp: 'Education was transferred to the Concurrent List by the 42nd Amendment in 1976.' },
  // Quant (51-75)
  51: { correct: 'B', exp: '35% of 240 = 0.35 × 240 = 84.' },
  52: { correct: 'C', exp: 'Let initial value be 100. Increased by 25% → 125. Decreased by 20% → 125 − 25 = 100 (No change).' },
  53: { correct: 'B', exp: 'Selling price = ₹800 × 1.15 = ₹920.' },
  54: { correct: 'B', exp: 'Selling price = ₹2,000 × (1 − 0.15) = ₹2,000 × 0.85 = ₹1,700.' },
  55: { correct: 'A', exp: 'Total work = LCM(15, 20) = 60 units. A = 4, B = 3. Together = 60 / 7 days.' },
  56: { correct: 'C', exp: 'Speed = 72 × (5/18) = 20 m/s. Distance = 20 m/s × 25 s = 500 m.' },
  57: { correct: 'B', exp: 'Ratio sum = 4 + 7 = 11. 1 unit = 99 / 11 = 9. Larger number = 7 × 9 = 63.' },
  58: { correct: 'B', exp: 'Sum = 12 × 18 = 216. New sum = 216 + 30 = 246. New average = 246 / 13 = 18 12/13.' },
  59: { correct: 'C', exp: 'SI = (8000 × 7.5 × 2) / 100 = ₹1,200.' },
  60: { correct: 'B', exp: 'Amount = 10000 × (1.10)² = ₹12,100. CI = ₹12,100 − ₹10,000 = ₹2,100.' },
  61: { correct: 'B', exp: 'Milk:Water = 3x:2x. (2x + 10) / 3x = 4 / 3 → 6x = 30 → x = 5. Original quantity = 5x = 25 L.' },
  62: { correct: 'C', exp: 'C gets 7x and A gets 3x. 7x − 3x = 4x = ₹1,600 → x = 400. Total sum = 15 × 400 = ₹6,000.' },
  63: { correct: 'B', exp: 'Substitute x = 5, y = 8: (3×5 + 2×8) / (3×5 − 2×8) = (15 + 16) / (15 − 16) = 31 / (−1) = −31.' },
  64: { correct: 'B', exp: 'a² + 1/a² = (a + 1/a)² − 2 = 4² − 2 = 14.' },
  65: { correct: 'C', exp: '72 = 24 × 3 and 120 = 24 × 5. HCF = 24.' },
  66: { correct: 'C', exp: '18 = 2 × 3², 24 = 2³ × 3, 30 = 2 × 3 × 5. LCM = 2³ × 3² × 5 = 360.' },
  67: { correct: 'B', exp: 'Time = 150/50 + 150/75 = 3 + 2 = 5 hours. Average speed = 300 / 5 = 60 km/h.' },
  68: { correct: 'B', exp: 'Time = (12 × 18) / (12 + 18) = 216 / 30 = 7.2 hours.' },
  69: { correct: 'C', exp: 'Circumference = 2 × (22/7) × 14 = 88 cm.' },
  70: { correct: 'B', exp: 'Side = √196 = 14 cm. Diagonal = 14√2 cm.' },
  71: { correct: 'B', exp: 'Volume = πr²h = (22/7) × 7 × 7 × 10 = 1,540 cm³.' },
  72: { correct: 'C', exp: 'Slant height = √(6² + 8²) = √100 = 10 cm.' },
  73: { correct: 'B', exp: 'cos θ = √(1 − sin² θ) = √(1 − 9/25) = 4/5.' },
  74: { correct: 'B', exp: 'Cost Price = ₹1,500 / 1.25 = ₹1,200.' },
  75: { correct: 'B', exp: 'Milk left = 80 × (1 − 20/80)² = 80 × (3/4)² = 80 × (9/16) = 45 L.' },
  // English (76-100)
  76: { correct: 'B', exp: 'Abundant means existing in large quantities; plentiful.' },
  77: { correct: 'C', exp: 'Hostile means antagonistic or aggressive; its antonym is friendly.' },
  78: { correct: 'B', exp: 'The correct spelling is "Privilege".' },
  79: { correct: 'B', exp: '"A blessing in disguise" means something that seems bad initially but turns out beneficial.' },
  80: { correct: 'B', exp: 'A polyglot is a person who knows and uses several languages.' },
  81: { correct: 'B', exp: '"Each of the students" takes a singular verb: "were given" must be "was given".' },
  82: { correct: 'A', exp: 'The appropriate preposition with "good" for a subject/skill is "at" (good at mathematics).' },
  83: { correct: 'A', exp: 'Present perfect passive: "Someone has stolen my wallet" → "My wallet has been stolen".' },
  84: { correct: 'B', exp: 'Indirect speech: He said, "I am busy." → He said that he was busy.' },
  85: { correct: 'C', exp: '"Capable" is followed by the preposition "of": capable of solving.' },
  86: { correct: 'A', exp: 'The correct spelling is "Entrepreneur".' },
  87: { correct: 'A', exp: '"Persistent" means continuing firmly despite slow initial results.' },
  88: { correct: 'A', exp: '"Tend to" takes the base form of the verb: "improve".' },
  89: { correct: 'B', exp: '"Systematically" means working in a structured, methodical manner.' },
  90: { correct: 'A', exp: '"Overwhelmed" means submerged or stressed by the size of the task.' },
  91: { correct: 'A', exp: '"Effective" is the appropriate adjective meaning achieving a desired result.' },
  92: { correct: 'B', exp: '"Neither... nor" with singular subjects takes a singular verb: "Neither Ram nor Shyam is present".' },
  93: { correct: 'C', exp: 'Transparent means clear; its antonym is opaque.' },
  94: { correct: 'C', exp: 'Inevitable means unavoidable; certain to occur.' },
  95: { correct: 'B', exp: '"For five years" expresses duration: "He has been working here for five years".' },
  96: { correct: 'A', exp: 'Proper sequence: Q (topic sentence) → P (first benefit) → R (second benefit) → S (conclusion).' },
  97: { correct: 'C', exp: 'Subjunctive mood in hypothetical conditional: "If I were you".' },
  98: { correct: 'B', exp: '"The news" is singular, so "are too important" should be "is too important".' },
  99: { correct: 'A', exp: '"One of the" requires a plural noun: "best players".' },
  100: { correct: 'C', exp: '"Ambiguous" means unclear or having double meanings so nobody could understand.' },
};

function detectSectionHeader(line: string): SectionId | null {
  const trimmed = line.trim();
  // 1. If it is an option line e.g. A) ..., it's never a section header
  if (isOptionLine(trimmed).isOption) {
    return null;
  }
  // 2. If it starts with a question number marker e.g. **36.** or 36. or Q36., it is NOT a section header!
  if (/^(?:\*{1,2}|_{1,2})?(?:Q(?:uestion)?\s*)?\d{1,3}[.):\-]/i.test(trimmed)) {
    return null;
  }

  // 3. Common sentence / question words never appear in section headers
  if (/\b(?:she|he|they|we|who|which|what|where|how|choose|find|select|identify|fill|calculate|solve|if|when|good|bad)\b/i.test(trimmed)) {
    return null;
  }

  const clean = trimmed.replace(/[*#_~`\-–—:0-9[\]]/g, ' ').trim().toLowerCase();

  // Section headers are concise (< 45 characters)
  if (clean.length > 45) {
    return null;
  }

  if (/\b(?:reasoning|general intelligence)\b/i.test(clean)) {
    return 'reasoning';
  }
  if (/\b(?:general awareness|general knowledge|gk|ga)\b/i.test(clean)) {
    return 'general_awareness';
  }
  if (/\b(?:quantitative aptitude|quantitative|quant|mathematics|maths|math)\b/i.test(clean)) {
    return 'quant';
  }
  if (/\b(?:english comprehension|english language|english)\b/i.test(clean)) {
    return 'english';
  }
  return null;
}

export function isOptionLine(line: string): {
  isOption: boolean;
  optionId?: 'A' | 'B' | 'C' | 'D';
  text?: string;
} {
  const trimmed = line.trim();
  // 1. Letters: A), A., (A), Option A:, **A)**, **A.**, A -
  const letterMatch = trimmed.match(
    /^(?:\*{1,2}|_{1,2})?(?:Option\s+)?(?:\(([A-Da-d])\)|([A-Da-d])\s*[).:\-–])(?:\*{1,2}|_{1,2})?\s*(.*)$/
  );
  if (letterMatch) {
    const rawId = (letterMatch[1] || letterMatch[2]).toUpperCase() as 'A' | 'B' | 'C' | 'D';
    return { isOption: true, optionId: rawId, text: letterMatch[3].trim() };
  }

  // 2. Numbered options: ONLY if enclosed in parenthesis e.g. (1), (2), or "Option 1:", or "1)"
  // NEVER plain "1." or "2." or "**2.**"!
  const numMatch = trimmed.match(
    /^(?:\*{1,2}|_{1,2})?(?:Option\s+([1-4])[:.\-–]?|\(([1-4])\)|([1-4])\s*\))(?:\*{1,2}|_{1,2})?\s*(.*)$/
  );
  if (numMatch) {
    const num = numMatch[1] || numMatch[2] || numMatch[3];
    const map: Record<string, 'A' | 'B' | 'C' | 'D'> = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
    return { isOption: true, optionId: map[num], text: numMatch[4].trim() };
  }

  return { isOption: false };
}

function isAnswerLine(line: string): { isAnswer: boolean; answer?: 'A' | 'B' | 'C' | 'D' } {
  const trimmed = line.trim();
  const match = trimmed.match(
    /^(?:\*{1,2})?(?:(?:Correct\s*)?Ans(?:wer)?(?: key)?|Correct Option|Key|उत्तर)[:\-–\s]+(?:\*{1,2})?([A-D1-4])\b/i
  );
  if (!match) return { isAnswer: false };
  const rawId = match[1].toUpperCase();
  let ansId: 'A' | 'B' | 'C' | 'D' = 'A';
  if (rawId === '1' || rawId === 'A') ansId = 'A';
  else if (rawId === '2' || rawId === 'B') ansId = 'B';
  else if (rawId === '3' || rawId === 'C') ansId = 'C';
  else if (rawId === '4' || rawId === 'D') ansId = 'D';
  return { isAnswer: true, answer: ansId };
}

export function parseRawQuestionsText(
  rawText: string,
  defaultSection: SectionId = 'reasoning',
  idOffset: number = 0,
  startQuestionNumber: number = 1
): ParseResult {
  const errors: string[] = [];
  if (!rawText || !rawText.trim()) {
    return {
      questions: [],
      stats: { totalParsed: 0, withFourOptions: 0, withExplicitAnswer: 0, withExplanation: 0 },
      errors: ['Please paste some questions to parse.'],
    };
  }

  const sectionNameMap: Record<SectionId, string> = {
    reasoning: 'General Intelligence & Reasoning',
    general_awareness: 'General Awareness',
    quant: 'Quantitative Aptitude',
    english: 'English Comprehension',
  };

  const cleanText = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = cleanText.split('\n');

  interface RawQuestionDraft {
    detectedNum: number;
    sectionId: SectionId;
    textLines: string[];
    optionsMap: Partial<Record<'A' | 'B' | 'C' | 'D', string>>;
    correctOption: 'A' | 'B' | 'C' | 'D';
    hasExplicitAnswer: boolean;
    explanationLines: string[];
  }

  const drafts: RawQuestionDraft[] = [];
  let currentDraft: RawQuestionDraft | null = null;
  let activeSection: SectionId = defaultSection;
  let pendingPassageLines: string[] = [];
  let lastClozePassageText: string = '';
  let isReadingExplanation = false;

  const finalizeDraft = (draft: RawQuestionDraft) => {
    if (draft.textLines.length === 0 && Object.keys(draft.optionsMap).length === 0) {
      return;
    }
    drafts.push(draft);
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 1. Check for Section Header (e.g. # 🌍 GENERAL AWARENESS — 25 Q, SUBJECT: REASONING)
    const detectedSec = detectSectionHeader(trimmed);
    if (detectedSec) {
      activeSection = detectedSec;
      isReadingExplanation = false;
      continue;
    }

    // 1b. Skip explicit CHAPTER and SUBTOPIC headings
    if (/^(?:\*{1,2}|_{1,2}|#+\s*)?(?:CHAPTER|TOPIC|SUBTOPIC|SUB-TOPIC|SUB\s+TOPIC)\s*[:\-–]/i.test(trimmed)) {
      continue;
    }

    // 2. Check for Cloze Test / Reading Comprehension context block
    if (
      trimmed.startsWith('### Cloze Test') ||
      trimmed.startsWith('### Reading Comprehension') ||
      trimmed.startsWith('### Passage') ||
      trimmed.startsWith('Directions (Q')
    ) {
      pendingPassageLines.push(trimmed);
      isReadingExplanation = false;
      continue;
    }
    if (
      pendingPassageLines.length > 0 &&
      (trimmed.startsWith('>') || (!trimmed.match(/^(?:\*{1,2})?\d{1,3}[.)]/) && !currentDraft))
    ) {
      pendingPassageLines.push(trimmed);
      continue;
    }

    // 3. Check for Question Start line
    const isOpt = isOptionLine(trimmed);
    const isAns = isAnswerLine(trimmed);

    // Differentiate question headers from options or sub-bullet items or matrix/table rows
    let isNewQuestionHeader = false;
    let extractedQNum = 0;
    let textAfterHeader = '';

    if (!isOpt.isOption && !isAns.isAnswer) {
      // Pattern 1: Explicit Q marker (Q1., Q1), Q.1, Question 1:, **Q1.**, etc.)
      const explicitQMatch = trimmed.match(
        /^(?:\*{1,2}|_{1,2})?(?:Q(?:uestion)?|Que|Ques|Prashna)\.?\s*(\d{1,4})(?:[.:)\-–]|\*{1,2}|_{1,2}|\s+)*(.*)$/i
      );

      // Pattern 2: Bold markdown number header: **1.** or **1)** or **1:** or **1**
      const boldNumMatch = trimmed.match(
        /^\*{2}(\d{1,4})(?:[.:)\-–])?\*{2}\s*(.*)$/
      );

      // Pattern 3: Bare number with MANDATORY delimiter (. or ) or : or -) followed by whitespace
      const bareNumMatch = trimmed.match(
        /^(\d{1,4})([.)\-–:])\s+(.*)$/
      );

      const prevDraftFinished =
        currentDraft && (Object.keys(currentDraft.optionsMap).length >= 2 || currentDraft.hasExplicitAnswer);

      if (explicitQMatch) {
        isNewQuestionHeader = true;
        extractedQNum = parseInt(explicitQMatch[1], 10);
        textAfterHeader = explicitQMatch[2].replace(/^[*_.:)\-–\s]+/, '').trim();
      } else if (boldNumMatch && (!currentDraft || prevDraftFinished)) {
        isNewQuestionHeader = true;
        extractedQNum = parseInt(boldNumMatch[1], 10);
        textAfterHeader = boldNumMatch[2].trim();
      } else if (bareNumMatch && (!currentDraft || prevDraftFinished)) {
        isNewQuestionHeader = true;
        extractedQNum = parseInt(bareNumMatch[1], 10);
        textAfterHeader = bareNumMatch[3].trim();
      }
    }

    if (isNewQuestionHeader) {
      if (currentDraft) {
        finalizeDraft(currentDraft);
      }

      isReadingExplanation = false;

      // Auto-assign section based on question number if standard 1-100 ranges
      let sectionForQuestion = activeSection;
      if (extractedQNum >= 1 && extractedQNum <= 25 && defaultSection === 'reasoning') {
        sectionForQuestion = 'reasoning';
      } else if (extractedQNum >= 26 && extractedQNum <= 50) {
        sectionForQuestion = 'general_awareness';
      } else if (extractedQNum >= 51 && extractedQNum <= 75) {
        sectionForQuestion = 'quant';
      } else if (extractedQNum >= 76 && extractedQNum <= 100) {
        sectionForQuestion = 'english';
      }

      currentDraft = {
        detectedNum: extractedQNum,
        sectionId: sectionForQuestion,
        textLines: [],
        optionsMap: {},
        correctOption: 'A',
        hasExplicitAnswer: false,
        explanationLines: [],
      };

      // If there was a pending cloze test or passage, record it and prepend it to this question
      if (pendingPassageLines.length > 0) {
        lastClozePassageText = pendingPassageLines.join('\n').trim();
        currentDraft.textLines.push(lastClozePassageText);
        pendingPassageLines = [];
      } else if (lastClozePassageText && extractedQNum >= 87 && extractedQNum <= 91) {
        // Blanks 88, 89, 90, 91 in cloze test also include passage reference
        currentDraft.textLines.push(`[Cloze Test Reference Passage]\n${lastClozePassageText}\n\nSelect the most appropriate option for blank (${extractedQNum}):`);
      }

      if (textAfterHeader) {
        currentDraft.textLines.push(textAfterHeader);
      }
      continue;
    }

    if (!currentDraft) {
      // Stray line before first question (e.g. passage or preamble)
      if (trimmed) pendingPassageLines.push(trimmed);
      continue;
    }

    // 4. Check for Explanation
    const expMatch = trimmed.match(/^(?:Explanation|Explain|Solution|Sol|Hint|Notes|व्याख्या|हल)[:\-–\s]+(.*)$/i);
    if (expMatch) {
      isReadingExplanation = true;
      if (expMatch[1]) currentDraft.explanationLines.push(expMatch[1].trim());
      continue;
    }

    if (isReadingExplanation) {
      if (trimmed) currentDraft.explanationLines.push(rawLine);
      continue;
    }

    // 5. Check for Answer Line
    if (isAns.isAnswer && isAns.answer) {
      currentDraft.hasExplicitAnswer = true;
      currentDraft.correctOption = isAns.answer;
      continue;
    }

    // 6. Check for Option Line (A, B, C, D)
    if (isOpt.isOption && isOpt.optionId && isOpt.text !== undefined) {
      currentDraft.optionsMap[isOpt.optionId] = isOpt.text;
      continue;
    }

    // 7. Otherwise, question body / text
    if (trimmed) {
      currentDraft.textLines.push(rawLine);
    }
  }

  if (currentDraft) {
    finalizeDraft(currentDraft);
  }

  // Convert drafts to final Question objects
  const parsedQuestions: Question[] = [];
  let withFourOptions = 0;
  let withExplicitAnswer = 0;
  let withExplanation = 0;

  drafts.forEach((draft, idx) => {
    try {
      const qNum = startQuestionNumber + idx;
      const detectedNum = draft.detectedNum || qNum;

      // Smart answer key lookup if not explicitly provided
      let finalCorrect = draft.correctOption;
      let finalExplanation = draft.explanationLines.join('\n').trim();

      if (!draft.hasExplicitAnswer && KNOWN_ANSWER_KEYS[detectedNum]) {
        finalCorrect = KNOWN_ANSWER_KEYS[detectedNum].correct;
        if (!finalExplanation) {
          finalExplanation = KNOWN_ANSWER_KEYS[detectedNum].exp;
        }
      }

      const options: QuestionOption[] = [
        { id: 'A', text: draft.optionsMap['A'] || 'Option A' },
        { id: 'B', text: draft.optionsMap['B'] || 'Option B' },
        { id: 'C', text: draft.optionsMap['C'] || 'Option C' },
        { id: 'D', text: draft.optionsMap['D'] || 'Option D' },
      ];

      const optionCount = ['A', 'B', 'C', 'D'].filter((k) =>
        Boolean(draft.optionsMap[k as 'A' | 'B' | 'C' | 'D'])
      ).length;

      if (optionCount >= 4) withFourOptions++;
      if (draft.hasExplicitAnswer || KNOWN_ANSWER_KEYS[detectedNum]) withExplicitAnswer++;
      if (finalExplanation) withExplanation++;

      let cleanedText = draft.textLines.join('\n').trim();
      if (!cleanedText) {
        cleanedText = `Question ${detectedNum}`;
      }

      parsedQuestions.push({
        id: 9000 + idOffset + idx + 1,
        sectionId: draft.sectionId,
        sectionName: sectionNameMap[draft.sectionId] || 'Subject',
        questionNumber: qNum,
        sectionQuestionNumber: idx + 1,
        text: cleanedText,
        options,
        correctOption: finalCorrect,
        explanation: finalExplanation || `Correct Answer: Option ${finalCorrect}.`,
        topic: 'SSC CGL Mock Drill',
        difficulty: 'Standard',
        marks: 2,
        negativeMarks: 0.5,
        recommendedTimeSeconds: 45,
      });
    } catch {
      errors.push(`Could not format Question ${idx + 1}.`);
    }
  });

  return {
    questions: parsedQuestions,
    stats: {
      totalParsed: parsedQuestions.length,
      withFourOptions,
      withExplicitAnswer,
      withExplanation,
    },
    errors,
  };
}

// Multi-section parser helper to auto-split a 100-question pasted paper into 4 subjects
export function parseAndDistributeBySubject(rawText: string): {
  allQuestions: Question[];
  bySection: Record<SectionId, Question[]>;
  rawTextBySection: Record<SectionId, string>;
  stats: {
    total: number;
    reasoning: number;
    general_awareness: number;
    quant: number;
    english: number;
  };
} {
  const result = parseRawQuestionsText(rawText, 'reasoning');

  const bySection: Record<SectionId, Question[]> = {
    reasoning: [],
    general_awareness: [],
    quant: [],
    english: [],
  };

  result.questions.forEach((q) => {
    bySection[q.sectionId].push(q);
  });

  // Re-sequence questions for each section so sectionQuestionNumber is 1..25
  (['reasoning', 'general_awareness', 'quant', 'english'] as SectionId[]).forEach((secId) => {
    bySection[secId] = bySection[secId].map((q, idx) => ({
      ...q,
      sectionQuestionNumber: idx + 1,
    }));
  });

  // Split raw text lines approximately by section headers for the 4 subject tabs
  const lines = rawText.replace(/\r\n/g, '\n').split('\n');
  const rawTextBySection: Record<SectionId, string[]> = {
    reasoning: [],
    general_awareness: [],
    quant: [],
    english: [],
  };

  let currentSec: SectionId = 'reasoning';
  for (const line of lines) {
    const secDetect = detectSectionHeader(line);
    if (secDetect) {
      currentSec = secDetect;
    }
    rawTextBySection[currentSec].push(line);
  }

  return {
    allQuestions: result.questions,
    bySection,
    rawTextBySection: {
      reasoning: rawTextBySection.reasoning.join('\n').trim(),
      general_awareness: rawTextBySection.general_awareness.join('\n').trim(),
      quant: rawTextBySection.quant.join('\n').trim(),
      english: rawTextBySection.english.join('\n').trim(),
    },
    stats: {
      total: result.questions.length,
      reasoning: bySection.reasoning.length,
      general_awareness: bySection.general_awareness.length,
      quant: bySection.quant.length,
      english: bySection.english.length,
    },
  };
}
