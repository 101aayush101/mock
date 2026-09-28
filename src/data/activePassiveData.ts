export interface ActivePassiveQuestion {
  qNum: number;
  questionText: string;
  source: string;
  options: {
    id: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  structureRule: string;
  mainExplanation: string;
  notes?: string;
  eliminations: {
    opt: 'A' | 'B' | 'C' | 'D';
    reason: string;
  }[];
  tags: string[];
}

export const ACTIVE_PASSIVE_THEORY = {
  title: 'Active & Passive Voice — SSC Masterclass',
  subtitle: 'Complete 6-Part Concept & 30-Second Solving Traps by Gopal Verma Sir',
  goldenSteps: [
    {
      step: 1,
      title: 'Object becomes Subject',
      desc: 'Object -> Subject बनता है। Passive तभी बनेगा जब verb Transitive हो (अर्थात verb का Object हो)।',
      example: 'She wrote a letter -> A letter was written by her.',
    },
    {
      step: 2,
      title: 'Pronoun Case Shift',
      desc: 'Subject -> (by) + Object form में बदलता है।',
      table: [
        { active: 'I', passive: 'me' },
        { active: 'We', passive: 'us' },
        { active: 'He', passive: 'him' },
        { active: 'She', passive: 'her' },
        { active: 'They', passive: 'them' },
        { active: 'Who', passive: 'by whom' },
      ],
    },
    {
      step: 3,
      title: 'Main Verb is ALWAYS V3',
      desc: 'बिना V3 (Past Participle) के Passive संभव ही नहीं है!',
      example: 'break -> broken, write -> written, clean -> cleaned',
    },
    {
      step: 4,
      title: 'Tense NEVER Changes',
      desc: 'Tense कभी नहीं बदलता, सिर्फ helping verb बदलता है: be की form + V3।',
      example: 'is/am/are (present) stays present; was/were (past) stays past.',
    },
    {
      step: 5,
      title: 'Agreement with New Subject',
      desc: 'Helping verb नए subject के अनुसार लगता है: singular -> is/was/has; plural -> are/were/have।',
      example: 'He bought cars -> Cars WERE bought (not was).',
    },
    {
      step: 6,
      title: 'Adverbs, Time & Place Stay Intact',
      desc: 'Adverb (successfully, quickly), time (yesterday, today), place (in Pune, at home) वैसे ही रहते हैं।',
      example: 'quickly drafted and sent -> quickly drafted and sent',
    },
  ],
  tenseChart: [
    { tense: 'Present Indefinite', active: 'V1 / V1(s/es)', passive: 'is / am / are + V3', trick: 'V1 -> is/am/are' },
    { tense: 'Present Continuous', active: 'is / am / are + V-ing', passive: 'is / am / are + being + V3', trick: 'Continuous = being' },
    { tense: 'Present Perfect', active: 'has / have + V3', passive: 'has / have + been + V3', trick: 'Perfect = been' },
    { tense: 'Past Indefinite', active: 'V2 (did + V1)', passive: 'was / were + V3', trick: 'V2 -> was/were' },
    { tense: 'Past Continuous', active: 'was / were + V-ing', passive: 'was / were + being + V3', trick: 'Continuous = being' },
    { tense: 'Past Perfect', active: 'had + V3', passive: 'had + been + V3', trick: 'Perfect = been' },
    { tense: 'Future Indefinite', active: 'will / shall + V1', passive: 'will / shall + be + V3', trick: 'Future = be' },
    { tense: 'Future Perfect', active: 'will have + V3', passive: 'will have + been + V3', trick: 'will have been + V3' },
    { tense: 'Modals (can/may/must/should)', active: 'Modal + V1', passive: 'Modal + be + V3', trick: 'Modal + be' },
    { tense: 'Modal Perfect', active: 'Modal + have + V3', passive: 'Modal + have + been + V3', trick: 'Modal + have been' },
  ],
  specialRules: [
    {
      category: 'Perfect Continuous (SSC 2026 Special)',
      summary: 'Traditional grammar says no passive, but SSC Steno 2026 repeatedly tested and accepted "been being + V3"!',
      points: [
        'has/have been + V-ing -> has/have been being + V3',
        'had been + V-ing -> had been being + V3',
        'will have been + V-ing -> will have been being + V3',
        'modal + have been + V-ing -> modal + have been being + V3',
        'Shortcut: If you see "been + V-ing" in Active, pick "been being + V3" in Passive!',
      ],
    },
    {
      category: 'Imperative & Requests',
      summary: 'Orders, instructions, and courteous requests',
      points: [
        'Imperative: V1 + Obj -> Let + Obj + be + V3 (e.g. Finish the work -> Let the work be finished)',
        'Negative: Don\'t + V1 -> Let + Obj + not be + V3',
        'Please / Kindly -> You are requested to + V1',
      ],
    },
    {
      category: 'Causatives & Bare Infinitives (make, see, hear)',
      summary: 'Active uses bare infinitive; Passive requires "to + V1"',
      points: [
        'Active: make/see/hear/help + obj + V1',
        'Passive: was/were made + to + V1 (e.g. made to clean, made to apologize)',
        'Passive to Active: "made to clean" -> "made him clean" ("to" gets dropped in active)',
      ],
    },
    {
      category: 'Impersonal & Noun Clauses ("It is said...")',
      summary: 'Sentences reporting belief, rumors, and claims',
      points: [
        'People say that... -> It is said that...',
        'They believe he has fled -> He is believed to have fled (to have + V3 for completed past action)',
        'Passive infinitive: to + V1 -> to be + V3; to have + V3 -> to have been + V3',
      ],
    },
    {
      category: 'Agent Drop & Reverse Active Assumption',
      summary: 'General or unknown agents are omitted in passive',
      points: [
        'Agent drop in passive: by someone / people / them / us is omitted',
        'Passive to Active conversion: If agent is missing, assume subject as Someone / They / People / The authorities',
        'Negative passive: "Not a word was spoken by any..." -> Active: "None of the witnesses spoke a word..."',
      ],
    },
    {
      category: 'Prepositional Verbs & Fixed Prepositions',
      summary: 'Prepositions must not be dropped!',
      points: [
        'rush to -> were rushed to (do not drop "to")',
        'look after -> was looked after; laugh at -> was laughed at',
        'Agents with instruments: use "with" for tools/instruments, "by" for doer',
        'Fixed verbs: known to, interested in, surprised at, filled with, covered with',
      ],
    },
  ],
  solvingTechnique: {
    name: '30-Second Parallel Scan Method',
    steps: [
      'Step 1: Focus solely on the helping verb -> Identify the tense immediately without reading the whole sentence.',
      'Step 2: Scan options for the matching tense auxiliary -> Eliminate 2 to 3 wrong options instantly.',
      'Step 3: Check V3 & Aspect markers -> "being" for continuous, "been" for perfect.',
      'Step 4: Verify subject-verb agreement -> was vs were, is vs are, has vs have for plural/singular.',
      'Step 5: Verify pronouns (he -> him), adverbs (quickly, thoroughly), and prepositions.',
    ],
    commonTraps: [
      'Trap 1: Missing "been" in perfect tense (e.g. has completed instead of has been completed)',
      'Trap 2: Missing "being" in continuous tense (e.g. is decorated instead of is being decorated)',
      'Trap 3: Unwanted Tense Shift (has -> had, is -> was) — direct/indirect speech changes tense, Voice NEVER does!',
      'Trap 4: Active sentence with "is + V3" (e.g. guard is switched off lights)',
      'Trap 5: Incorrect "to" in causative active (e.g. made the child to apologize)',
      'Trap 6: Dropping adverbs or adjectives (e.g. thoroughly, successfully, notorious)',
      'Trap 7: Agreement mismatch (plural "schemes / kids / teenagers" with singular was/is/has)',
    ],
  },
};
