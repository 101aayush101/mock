import { SectionId } from '../types';

export interface ClassificationResult {
  subject: 'Reasoning' | 'Quantitative Aptitude' | 'English' | 'General Awareness' | 'Computer';
  topic: string;
  subtopic: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  sectionId: SectionId;
}

export interface SubjectHierarchy {
  [subject: string]: {
    [topic: string]: string[];
  };
}

// Canonical SSC CGL Topics & Subtopics hierarchy
export const SSC_CLASSIFICATION_TAXONOMY: SubjectHierarchy = {
  Reasoning: {
    Analogy: ['Letter Analogy', 'Number Analogy', 'Word Analogy', 'Semantic Analogy'],
    Classification: ['Number Classification', 'Letter Classification', 'Word Classification'],
    'Number Series': ['Arithmetic Series', 'Square & Cube Series', 'Alternating Series', 'Fibonacci Series'],
    'Alphabet Series': ['Letter Series', 'Continuous Pattern Series'],
    'Coding-Decoding': ['Letter Coding', 'Number Coding', 'Substitution Coding', 'Matrix Coding'],
    'Blood Relation': ['Coded Blood Relation', 'Pointing / Direct Relation', 'Family Tree'],
    'Direction & Distance': ['Direction Sense', 'Shortest Distance (Pythagoras)', 'Shadow Based'],
    Syllogism: ['Statement & Conclusion', 'Some / All Statements', 'Possibility Cases'],
    'Venn Diagram': ['Overlapping Sets', 'Geometric Figures Venn'],
    'Mathematical Operations': ['Interchange of Signs', 'Interchange of Numbers', 'BODMAS in Reasoning'],
    'Missing Number': ['Matrix / Grid Pattern', 'Circular Missing Number', 'Table Pattern'],
    'Order & Ranking': ['Linear Ranking', 'Comparison of Heights & Ages'],
    'Seating Arrangement': ['Linear Seating', 'Circular Seating'],
    'Clock & Calendar': ['Angle between Hands', 'Day of the Week Calculation'],
    'Non-Verbal Reasoning': ['Mirror Image', 'Water Image', 'Paper Folding & Cutting', 'Embedded Figures', 'Dice & Cube'],
    'Word Formation': ['Dictionary Order', 'Logical & Meaningful Sequence'],
  },
  'Quantitative Aptitude': {
    'Number System': ['Divisibility Rules', 'Unit Digit & Remainders', 'LCM & HCF', 'Prime Numbers & Factors'],
    Percentage: ['Percentage Increase/Decrease', 'Successive Percentage', 'Consumption & Expenditure'],
    'Profit & Loss': ['Cost Price & Selling Price', 'Marked Price & Discount', 'Dishonest Trader'],
    'Ratio & Proportion': ['Direct & Inverse Proportion', 'Mean & Third Proportional', 'Partnership'],
    Average: ['Weighted Average', 'Inclusion / Exclusion', 'Batting / Bowling Average'],
    'Mixture & Alligation': ['Rule of Alligation', 'Replacement of Liquids'],
    'Time & Work': ['Work Efficiency', 'Alternating Days', 'Pipes & Cisterns', 'Wages'],
    'Time, Speed & Distance': ['Trains & Platforms', 'Boats & Streams', 'Relative Speed', 'Races'],
    'Simple & Compound Interest': ['Simple Interest', 'Compound Interest', 'Difference between CI and SI'],
    Algebra: ['Algebraic Identities', 'Quadratic Equations', 'Symmetric Expressions'],
    Geometry: ['Triangles & Congruence', 'Circles & Tangents', 'Quadrilaterals', 'Angles & Transversals'],
    Mensuration: ['2D Area & Perimeter', '3D Volume & Surface Area (Cylinder, Cone, Sphere)'],
    Trigonometry: ['Trigonometric Ratios & Identities', 'Heights & Distances', 'Max & Min Values'],
    'Data Interpretation': ['Bar Graph', 'Pie Chart', 'Table DI', 'Line Graph'],
    Simplification: ['BODMAS Rules', 'Surds & Indices', 'Fractions & Decimals'],
  },
  English: {
    Vocabulary: ['Synonyms', 'Antonyms', 'Spelling Test / Correctly Spelt'],
    'Idioms & Phrases': ['Idiomatic Expressions', 'Phrasal Verbs'],
    'One Word Substitution': ['Lexical Substitution', 'Specialized Terms & Phobias'],
    Grammar: ['Error Detection / Spotting Errors', 'Subject-Verb Agreement', 'Preposition Errors'],
    'Sentence Improvement': ['Phrase Replacement', 'Grammatical Correction'],
    'Fill in the Blanks': ['Single Blank', 'Double Blank', 'Prepositions & Connectors'],
    'Cloze Test': ['Passage Cloze', 'Contextual Vocabulary'],
    'Reading Comprehension': ['Passage Comprehension', 'Inference & Title'],
    'Active & Passive Voice': ['Voice Conversion', 'Tense Rules in Voice'],
    'Direct & Indirect Speech': ['Narration Conversion', 'Reporting Verbs & Pronoun Rules'],
    'Para Jumbles': ['Sentence Rearrangement (PQRS)', 'Paragraph Organization'],
  },
  'General Awareness': {
    Polity: ['Articles & Amendments', 'Fundamental Rights & Duties', 'Parliament & President', 'Judiciary', 'Constitutional Bodies'],
    History: ['Ancient India (Indus Valley, Maurya)', 'Medieval India (Mughals, Sultanate)', 'Modern India & Freedom Struggle (1857-1947)'],
    Geography: ['Physical Geography of India', 'Rivers, Dams & Lakes', 'Agriculture & Soil Types', 'Solar System & Atmosphere'],
    Economics: ['Banking & RBI Policy', 'Taxation & GST', 'National Income & GDP', 'Five Year Plans & NITI Aayog'],
    Science: ['Physics (Optics, Mechanics, Units)', 'Chemistry (Periodic Table, Acids & Bases)', 'Biology (Human Anatomy, Diseases, Vitamins)'],
    'Static GK': ['Classical & Folk Dances', 'Festivals & Art Culture', 'National Parks & Sanctuaries', 'Books & Authors', 'Important Days'],
    'Current Affairs': ['Sports Tournaments & Cups', 'Awards & Honors (Nobel, Padma)', 'Government Schemes', 'Summits & Appointments'],
    'Defence & Space': ['ISRO Missions', 'DRDO & Satellites', 'Military Exercises'],
  },
  Computer: {
    'Computer Fundamentals': ['History & Generations', 'Memory (RAM, ROM, Cache)', 'Architecture & CPU'],
    'Hardware & Software': ['Input & Output Devices', 'Storage Systems', 'System vs Application Software'],
    'Operating System': ['Windows OS & Shortcuts', 'Linux & Shell', 'Process Management'],
    'MS Office': ['MS Word (Shortcuts & Formatting)', 'MS Excel (Formulas & Charts)', 'MS PowerPoint'],
    'Internet & Networking': ['Network Topologies', 'Protocols (HTTP, IP, DNS, SMTP)', 'Web Browsing'],
    'Cyber Security': ['Malware, Viruses & Trojans', 'Firewalls & Antivirus', 'Phishing & Encryption'],
    Database: ['DBMS Fundamentals', 'SQL Queries & Tables'],
  },
};

export const SUBJECT_TO_SECTION_ID: Record<string, SectionId> = {
  Reasoning: 'reasoning',
  'Quantitative Aptitude': 'quant',
  English: 'english',
  'General Awareness': 'general_awareness',
  Computer: 'general_awareness', // mapped to GA or standalone in sectional mocks
};

export function classifyQuestion(
  text: string,
  options: { A?: string; B?: string; C?: string; D?: string } = {},
  explanation: string = ''
): ClassificationResult {
  const combined = `${text}\n${options.A || ''}\n${options.B || ''}\n${options.C || ''}\n${options.D || ''}\n${explanation}`.toLowerCase();

  // 1. Check Computer Keywords first (very specific)
  if (
    /\b(?:ram|rom|cpu|cache memory|operating system|ms word|ms excel|ms office|powerpoint|spreadsheet|firewall|malware|trojan|phishing|antivirus|http|https|smtp|dns|tcp\/ip|ip address|topology|lan|wan|dbms|sql query|relational database|motherboard|hard disk|ssd|von neumann)\b/i.test(combined)
  ) {
    if (/\b(?:excel|spreadsheet|formula|workbook|cell)\b/i.test(combined)) {
      return { subject: 'Computer', topic: 'MS Office', subtopic: 'MS Excel (Formulas & Charts)', difficulty: 'Moderate', sectionId: 'general_awareness' };
    }
    if (/\b(?:firewall|virus|trojan|malware|cyber|phishing|encryption)\b/i.test(combined)) {
      return { subject: 'Computer', topic: 'Cyber Security', subtopic: 'Malware, Viruses & Trojans', difficulty: 'Easy', sectionId: 'general_awareness' };
    }
    if (/\b(?:network|topology|protocol|http|dns|tcp|ip address|lan)\b/i.test(combined)) {
      return { subject: 'Computer', topic: 'Internet & Networking', subtopic: 'Protocols (HTTP, IP, DNS, SMTP)', difficulty: 'Moderate', sectionId: 'general_awareness' };
    }
    if (/\b(?:windows|linux|unix|operating system|kernel)\b/i.test(combined)) {
      return { subject: 'Computer', topic: 'Operating System', subtopic: 'Windows OS & Shortcuts', difficulty: 'Easy', sectionId: 'general_awareness' };
    }
    return { subject: 'Computer', topic: 'Computer Fundamentals', subtopic: 'Memory (RAM, ROM, Cache)', difficulty: 'Easy', sectionId: 'general_awareness' };
  }

  // 2. Check English Comprehension
  if (
    /\b(?:synonym|antonym|idiom|spelt|misspelt|spelling|one-word|substitute|grammatical error|grammatical|rectifies|underlined segment|underlined words?|passive voice|active voice|indirect speech|direct speech|reported speech|cloze test|para jumbles?|pqrs|fill in the blank|blanks?|preposition|neither.*nor|either.*or|part of speech|vocabulary|most appropriate option|most appropriate meaning|correctly spelt|incorrectly spelt|sentence improvement|spotting error|select the option that expresses|segment that contains a grammatical error|substitute the bracketed|select the most appropriate)\b/i.test(combined)
  ) {
    if (/\b(?:synonym|closest in meaning|same meaning|synonymous)\b/i.test(combined)) {
      return { subject: 'English', topic: 'Vocabulary', subtopic: 'Synonyms', difficulty: 'Moderate', sectionId: 'english' };
    }
    if (/\b(?:antonym|opposite in meaning)\b/i.test(combined)) {
      return { subject: 'English', topic: 'Vocabulary', subtopic: 'Antonyms', difficulty: 'Moderate', sectionId: 'english' };
    }
    if (/\b(?:spelt|spelling|correctly spelt|misspelt|incorrectly spelt)\b/i.test(combined)) {
      return { subject: 'English', topic: 'Vocabulary', subtopic: 'Spelling Test / Correctly Spelt', difficulty: 'Easy', sectionId: 'english' };
    }
    if (/\b(?:idiom|phrase|idiomatic|meaning of the given idiom|bite the bullet|blessing in disguise|spill the beans)\b/i.test(combined)) {
      return { subject: 'English', topic: 'Idioms & Phrases', subtopic: 'Idiomatic Expressions', difficulty: 'Moderate', sectionId: 'english' };
    }
    if (/\b(?:one-word|one word|substitute for the phrase|person who|substitute the bracketed)\b/i.test(combined)) {
      return { subject: 'English', topic: 'One Word Substitution', subtopic: 'Lexical Substitution', difficulty: 'Moderate', sectionId: 'english' };
    }
    if (/\b(?:passive voice|active voice|expresses the given sentence in)\b/i.test(combined)) {
      return { subject: 'English', topic: 'Active & Passive Voice', subtopic: 'Voice Conversion', difficulty: 'Moderate', sectionId: 'english' };
    }
    if (/\b(?:indirect speech|direct speech|said that|narration|reported speech)\b/i.test(combined)) {
      return { subject: 'English', topic: 'Direct & Indirect Speech', subtopic: 'Narration Conversion', difficulty: 'Moderate', sectionId: 'english' };
    }
    if (/\b(?:error|identify the error|spotting error|grammatical|segment that contains)\b/i.test(combined)) {
      return { subject: 'English', topic: 'Grammar', subtopic: 'Error Detection / Spotting Errors', difficulty: 'Hard', sectionId: 'english' };
    }
    if (/\b(?:improvement|replace the underlined|substitute the underlined|substitute)\b/i.test(combined)) {
      return { subject: 'English', topic: 'Sentence Improvement', subtopic: 'Phrase Replacement', difficulty: 'Moderate', sectionId: 'english' };
    }
    if (/\b(?:fill in the blank|blank)\b/i.test(combined)) {
      return { subject: 'English', topic: 'Fill in the Blanks', subtopic: 'Prepositions & Connectors', difficulty: 'Easy', sectionId: 'english' };
    }
    if (/\b(?:cloze test|reference passage)\b/i.test(combined)) {
      return { subject: 'English', topic: 'Cloze Test', subtopic: 'Passage Cloze', difficulty: 'Moderate', sectionId: 'english' };
    }
    if (/\b(?:rearrange|pqrs|order of sentences|para jumble)\b/i.test(combined)) {
      return { subject: 'English', topic: 'Para Jumbles', subtopic: 'Sentence Rearrangement (PQRS)', difficulty: 'Moderate', sectionId: 'english' };
    }
    return { subject: 'English', topic: 'Grammar', subtopic: 'Subject-Verb Agreement', difficulty: 'Moderate', sectionId: 'english' };
  }

  // 3. Check Quantitative Aptitude (Maths)
  if (
    /\b(?:cost price|selling price|marked price|discount|profit|loss|simple interest|compound interest|p\.a\.|si =|ci =|sum of money|ratio|proportion|hcf|lcm|divisible|remainder|unit digit|average of|weighted average|speed of the train|km\/h|m\/s|upstream|downstream|time and work|work in \d+ days|pipes?|cistern|mixture|alligation|radius|cone|cylinder|sphere|triangle|hypotenuse|sinθ|cosθ|tanθ|trigonometry|quadratic equation|x\s*\+\s*1\/x|x²|algebraic|diagonal of a square|circumference|mensuration)\b/i.test(combined) ||
    /(\d+%\s*of\s*\d+|₹|\bcp\b|\bsp\b|\bmp\b|\b\d+:\d+\b|\b\d+\s*km\/h\b)/i.test(combined)
  ) {
    if (/\b(?:profit|loss|cost price|selling price|marked price|discount|shopkeeper|markup)\b/i.test(combined)) {
      return { subject: 'Quantitative Aptitude', topic: 'Profit & Loss', subtopic: 'Marked Price & Discount', difficulty: 'Moderate', sectionId: 'quant' };
    }
    if (/\b(?:simple interest|compound interest|p\.a\.|rate of interest|sum becomes)\b/i.test(combined)) {
      return { subject: 'Quantitative Aptitude', topic: 'Simple & Compound Interest', subtopic: 'Simple Interest', difficulty: 'Moderate', sectionId: 'quant' };
    }
    if (/\b(?:train|km\/h|speed|distance|platform|crosses|relative speed|boat|stream)\b/i.test(combined)) {
      return { subject: 'Quantitative Aptitude', topic: 'Time, Speed & Distance', subtopic: 'Trains & Platforms', difficulty: 'Moderate', sectionId: 'quant' };
    }
    if (/\b(?:work|days|efficiency|together they|pipes?|cistern|fill.*tank|leak)\b/i.test(combined)) {
      return { subject: 'Quantitative Aptitude', topic: 'Time & Work', subtopic: 'Work Efficiency', difficulty: 'Moderate', sectionId: 'quant' };
    }
    if (/\b(?:mixture|alligation|milk and water|replaced with water|ratio becomes)\b/i.test(combined)) {
      return { subject: 'Quantitative Aptitude', topic: 'Mixture & Alligation', subtopic: 'Replacement of Liquids', difficulty: 'Hard', sectionId: 'quant' };
    }
    if (/\b(?:ratio|proportion|divided among|shares? of a, b)\b/i.test(combined)) {
      return { subject: 'Quantitative Aptitude', topic: 'Ratio & Proportion', subtopic: 'Direct & Inverse Proportion', difficulty: 'Easy', sectionId: 'quant' };
    }
    if (/\b(?:average of|mean of|new average|cricketer)\b/i.test(combined)) {
      return { subject: 'Quantitative Aptitude', topic: 'Average', subtopic: 'Weighted Average', difficulty: 'Easy', sectionId: 'quant' };
    }
    if (/\b(?:percentage|% of|increased by \d+%|decreased by \d+%)\b/i.test(combined)) {
      return { subject: 'Quantitative Aptitude', topic: 'Percentage', subtopic: 'Percentage Increase/Decrease', difficulty: 'Easy', sectionId: 'quant' };
    }
    if (/\b(?:sin|cos|tan|cot|sec|cosec|θ|acute angle|heights and distances?|elevation)\b/i.test(combined)) {
      return { subject: 'Quantitative Aptitude', topic: 'Trigonometry', subtopic: 'Trigonometric Ratios & Identities', difficulty: 'Moderate', sectionId: 'quant' };
    }
    if (/\b(?:cylinder|cone|sphere|radius|volume|slant height|area of a circle|circumference|square has area|diagonal)\b/i.test(combined)) {
      return { subject: 'Quantitative Aptitude', topic: 'Mensuration', subtopic: '3D Volume & Surface Area (Cylinder, Cone, Sphere)', difficulty: 'Moderate', sectionId: 'quant' };
    }
    if (/\b(?:triangle|circle|tangent|chord|angle|parallel lines|perpendicular|quadrilateral)\b/i.test(combined)) {
      return { subject: 'Quantitative Aptitude', topic: 'Geometry', subtopic: 'Circles & Tangents', difficulty: 'Hard', sectionId: 'quant' };
    }
    if (/\b(?:x\s*\+\s*1\/x|a\^2|x²|algebra|polynomial|identity|roots)\b/i.test(combined)) {
      return { subject: 'Quantitative Aptitude', topic: 'Algebra', subtopic: 'Algebraic Identities', difficulty: 'Moderate', sectionId: 'quant' };
    }
    if (/\b(?:hcf|lcm|divisible|remainder|unit digit|prime number)\b/i.test(combined)) {
      return { subject: 'Quantitative Aptitude', topic: 'Number System', subtopic: 'LCM & HCF', difficulty: 'Easy', sectionId: 'quant' };
    }
    return { subject: 'Quantitative Aptitude', topic: 'Simplification', subtopic: 'BODMAS Rules', difficulty: 'Easy', sectionId: 'quant' };
  }

  // 4. Check Reasoning (General Intelligence)
  if (
    /::|\b(?:analogy|cluster|odd one out|number-pair|syllogism|statements?:|conclusions?:|father of|mother of|sister of|brother of|aunt of|uncle of|coded as|written as|missing number|given pattern|series|walks.*south|turns left|facing north|seating arrangement|venn diagram|mirror image|water image|paper folding)\b/i.test(combined)
  ) {
    if (/::|\b(?:related to the third letter-cluster|related in the same way|analogy)\b/i.test(combined)) {
      const isLetter = /[A-Z]{2,}\s*:\s*[A-Z]{2,}/i.test(combined);
      return {
        subject: 'Reasoning',
        topic: 'Analogy',
        subtopic: isLetter ? 'Letter Analogy' : 'Number Analogy',
        difficulty: 'Moderate',
        sectionId: 'reasoning',
      };
    }
    if (/\b(?:odd one out|alike in a certain way|different)\b/i.test(combined)) {
      const isNum = /\d+\s*:\s*\d+/i.test(combined);
      return {
        subject: 'Reasoning',
        topic: 'Classification',
        subtopic: isNum ? 'Number Classification' : 'Letter Classification',
        difficulty: 'Easy',
        sectionId: 'reasoning',
      };
    }
    if (/\b(?:statements?:|conclusions?:|follows|syllogism)\b/i.test(combined)) {
      return { subject: 'Reasoning', topic: 'Syllogism', subtopic: 'Statement & Conclusion', difficulty: 'Moderate', sectionId: 'reasoning' };
    }
    if (/\b(?:father|mother|sister|brother|aunt|uncle|son|daughter|nephew|niece|grandfather|grandmother|relation|pointing towards)\b/i.test(combined)) {
      const isCoded = /['"][A-Z]\s*[+\-×÷*]\s*[A-Z]['"]/i.test(combined);
      return {
        subject: 'Reasoning',
        topic: 'Blood Relation',
        subtopic: isCoded ? 'Coded Blood Relation' : 'Pointing / Direct Relation',
        difficulty: isCoded ? 'Hard' : 'Moderate',
        sectionId: 'reasoning',
      };
    }
    if (/\b(?:walks|turns left|turns right|north|south|east|west|direction)\b/i.test(combined)) {
      return { subject: 'Reasoning', topic: 'Direction & Distance', subtopic: 'Direction Sense', difficulty: 'Moderate', sectionId: 'reasoning' };
    }
    if (/\b(?:missing number|pattern|matrix|\?)\b/i.test(combined) && /\d+.*\n.*\d+/.test(combined)) {
      return { subject: 'Reasoning', topic: 'Missing Number', subtopic: 'Matrix / Grid Pattern', difficulty: 'Hard', sectionId: 'reasoning' };
    }
    if (/\b(?:coded as|written as|code)\b/i.test(combined)) {
      return { subject: 'Reasoning', topic: 'Coding-Decoding', subtopic: 'Letter Coding', difficulty: 'Moderate', sectionId: 'reasoning' };
    }
    if (/\b(?:series|missing term|next term)\b/i.test(combined)) {
      const isLetter = /[A-Z]{1,2},\s*[A-Z]{1,2}/i.test(combined);
      return {
        subject: 'Reasoning',
        topic: isLetter ? 'Alphabet Series' : 'Number Series',
        subtopic: isLetter ? 'Letter Series' : 'Arithmetic Series',
        difficulty: 'Moderate',
        sectionId: 'reasoning',
      };
    }
    if (/\b(?:venn diagram|represents?)\b/i.test(combined)) {
      return { subject: 'Reasoning', topic: 'Venn Diagram', subtopic: 'Overlapping Sets', difficulty: 'Easy', sectionId: 'reasoning' };
    }
    if (/\b(?:means '\+',|means '×'|interchanged|mathematical operations)\b/i.test(combined)) {
      return { subject: 'Reasoning', topic: 'Mathematical Operations', subtopic: 'Interchange of Signs', difficulty: 'Easy', sectionId: 'reasoning' };
    }
    if (/\b(?:sit in a row|facing north|circular table|round table|arrangement)\b/i.test(combined)) {
      return { subject: 'Reasoning', topic: 'Seating Arrangement', subtopic: 'Linear Seating', difficulty: 'Hard', sectionId: 'reasoning' };
    }
    if (/\b(?:ranks?|from the top|from the bottom|taller than|shorter than)\b/i.test(combined)) {
      return { subject: 'Reasoning', topic: 'Order & Ranking', subtopic: 'Linear Ranking', difficulty: 'Easy', sectionId: 'reasoning' };
    }
    if (/\b(?:clock|angle between|calendar|day of the week)\b/i.test(combined)) {
      return { subject: 'Reasoning', topic: 'Clock & Calendar', subtopic: 'Angle between Hands', difficulty: 'Moderate', sectionId: 'reasoning' };
    }
    return { subject: 'Reasoning', topic: 'Analogy', subtopic: 'Letter Analogy', difficulty: 'Moderate', sectionId: 'reasoning' };
  }

  // 5. General Awareness (Default / Fallback)
  if (/\b(?:article|constitution|amendment|lok sabha|rajya sabha|president|parliament|governor|supreme court|high court|panchayat|fundamental rights?|dpsp)\b/i.test(combined)) {
    return { subject: 'General Awareness', topic: 'Polity', subtopic: 'Articles & Amendments', difficulty: 'Moderate', sectionId: 'general_awareness' };
  }
  if (/\b(?:battle|revolt of 1857|simon commission|mughal|sultanate|indus valley|buddhism|jainism|mauryan|ashoka|gandhi|nehru|quit india|british east india)\b/i.test(combined)) {
    return { subject: 'General Awareness', topic: 'History', subtopic: 'Modern India & Freedom Struggle (1857-1947)', difficulty: 'Moderate', sectionId: 'general_awareness' };
  }
  if (/\b(?:river|lake|mountain|soil|kharif|rabi|plateau|crop|delta|dam|sanctuary|planet|mars|atmosphere|monsoon|originates)\b/i.test(combined)) {
    return { subject: 'General Awareness', topic: 'Geography', subtopic: 'Rivers, Dams & Lakes', difficulty: 'Moderate', sectionId: 'general_awareness' };
  }
  if (/\b(?:repo rate|rbi|gst|inflation|gdp|monetary policy|tax|planning commission|niti aayog|budget|fiscal)\b/i.test(combined)) {
    return { subject: 'General Awareness', topic: 'Economics', subtopic: 'Banking & RBI Policy', difficulty: 'Moderate', sectionId: 'general_awareness' };
  }
  if (/\b(?:vitamin|ph of|liquid at room temperature|metal|acid|base|blood group|kidney|cell|newton|joule|optics|periodic table|nobel prize in physics|chemical)\b/i.test(combined)) {
    return { subject: 'General Awareness', topic: 'Science', subtopic: 'Biology (Human Anatomy, Diseases, Vitamins)', difficulty: 'Easy', sectionId: 'general_awareness' };
  }
  if (/\b(?:dance|festival|assam|kerala|sattriya|kathakali|bharatanatyam|book|author|headquarters|imf|un|unesco|who|world bank)\b/i.test(combined)) {
    return { subject: 'General Awareness', topic: 'Static GK', subtopic: 'Classical & Folk Dances', difficulty: 'Easy', sectionId: 'general_awareness' };
  }
  if (/\b(?:isro|spadex|nisar|navic|chandrayaan|satellite|mission|drdo)\b/i.test(combined)) {
    return { subject: 'General Awareness', topic: 'Defence & Space', subtopic: 'ISRO Missions', difficulty: 'Moderate', sectionId: 'general_awareness' };
  }

  // Default to General Awareness - Static GK
  return {
    subject: 'General Awareness',
    topic: 'Static GK',
    subtopic: 'Important Days',
    difficulty: 'Moderate',
    sectionId: 'general_awareness',
  };
}
