// Bilingual support mapping for SSC CGL questions (English & Hindi)
// Provides authentic Hindi translations matching standard SSC/Testbook exam paper language

export interface HindiQuestionData {
  textHindi: string;
  optionsHindi?: Record<'A' | 'B' | 'C' | 'D', string>;
  explanationHindi?: string;
}

export const HINDI_QUESTION_MAP: Record<number, HindiQuestionData> = {
  // Reasoning
  1: {
    textHindi: 'उस विकल्प का चयन करें जिसमें संख्याएं उसी प्रकार संबंधित हैं जैसे दिए गए युग्म में संख्याएं संबंधित हैं:\n\n18 : 324 :: 23 : ?',
    optionsHindi: {
      A: '529',
      B: '506',
      C: '552',
      D: '484',
    },
    explanationHindi: 'संबंध n : n² का है।\n• 18² = 324\n• इसी प्रकार, 23² = 529। अतः सही उत्तर 529 (विकल्प A) है।',
  },
  2: {
    textHindi: 'लुप्त संख्या ज्ञात कीजिए:\n\n7,  14,  30,  64,  130,  ?',
    optionsHindi: {
      A: '260',
      B: '264',
      C: '262',
      D: '268',
    },
    explanationHindi: 'पैटर्न: 7×2=14, 14×2+2=30, 30×2+4=64, 64×2+2=130, 130×2+4=264। अतः 264 (विकल्प B)।',
  },
  3: {
    textHindi: 'एक निश्चित कूट भाषा में, MARKET को NBSLFU लिखा जाता है। उसी कूट भाषा में CREDIT को कैसे लिखा जाएगा?',
    optionsHindi: {
      A: 'DSFEJU',
      B: 'DSEFJU',
      C: 'DSFEIT',
      D: 'CRFEJU',
    },
    explanationHindi: 'प्रत्येक अक्षर में +1 की वृद्धि है: C+1=D, R+1=S, E+1=F, D+1=E, I+1=J, T+1=U => DSFEJU (विकल्प A)।',
  },
  4: {
    textHindi: 'दिए गए आव्यूह में प्रश्न चिह्न (?) के स्थान पर आने वाली संख्या का चयन करें:\n\n[ 8   5   39 ]\n[ 7   6   43 ]\n[ 9   4    ? ]',
    optionsHindi: {
      A: '45',
      B: '47',
      C: '49',
      D: '43',
    },
    explanationHindi: 'पैटर्न: (पहला पद × दूसरा पद) - 1 = तीसरा पद।\n8×5 - 1 = 39, 7×6 + 1 = 43, 9×4 - 1 = ? या 8² - 5² = 39, 7² - 6 = 43, 9×4 + 11 = 47। अतः 47 (विकल्प B)।',
  },
  5: {
    textHindi: 'कथन:\n1. कुछ किताबें पेन हैं।\n2. सभी पेन पेंसिल हैं।\n\nनिष्कर्ष:\nI. कुछ पेंसिल किताबें हैं।\nII. कुछ किताबें पेंसिल हैं।',
    optionsHindi: {
      A: 'केवल निष्कर्ष I अनुसरण करता है',
      B: 'केवल निष्कर्ष II अनुसरण करता है',
      C: 'दोनों निष्कर्ष I और II अनुसरण करते हैं',
      D: 'न तो I और न ही II अनुसरण करता है',
    },
    explanationHindi: 'वेन आरेख विश्लेषण से दोनों निष्कर्ष I और II सत्य सिद्ध होते हैं। अतः विकल्प C।',
  },

  // General Awareness
  26: {
    textHindi: 'भारत के संविधान का कौन सा अनुच्छेद विशेष रूप से भारत के राष्ट्रपति के चुनाव से संबंधित है?',
    optionsHindi: {
      A: 'अनुच्छेद 52',
      B: 'अनुच्छेद 54',
      C: 'अनुच्छेद 56',
      D: 'अनुच्छेद 58',
    },
    explanationHindi: 'अनुच्छेद 54 राष्ट्रपति के चुनाव के लिए निर्वाचक मंडल (संसद के दोनों सदनों और राज्यों की विधानसभाओं के निर्वाचित सदस्य) का प्रावधान करता है। अतः विकल्प B।',
  },
  27: {
    textHindi: 'राज्यसभा के संबंध में निम्नलिखित कथनों पर विचार कीजिए:\n1. यह एक स्थायी सदन है और इसका विघटन नहीं हो सकता।\n2. इसके एक-तिहाई सदस्य प्रत्येक दो वर्ष में सेवानिवृत्त होते हैं।\n3. संविधान के तहत इसकी अधिकतम अनुमेय संख्या 250 है।\n\nउपर्युक्त में से कौन से कथन सही हैं?',
    optionsHindi: {
      A: 'केवल 1',
      B: 'केवल 1 और 2',
      C: 'केवल 2 और 3',
      D: '1, 2 और 3 सभी',
    },
    explanationHindi: 'अनुच्छेद 80 और 83 के तहत तीनों कथन पूर्णतः सत्य हैं। अतः विकल्प D।',
  },
  28: {
    textHindi: 'भारत के संविधान के भाग III के तहत निम्नलिखित में से कौन सा एक मौलिक अधिकार नहीं है?',
    optionsHindi: {
      A: 'समानता का अधिकार',
      B: 'स्वतंत्रता का अधिकार',
      C: 'संपत्ति का अधिकार',
      D: 'शोषण के विरुद्ध अधिकार',
    },
    explanationHindi: 'संपत्ति के अधिकार को 44वें संविधान संशोधन 1978 द्वारा मौलिक अधिकारों से हटाकर अनुच्छेद 300A के तहत विधिक अधिकार बना दिया गया। अतः विकल्प C।',
  },
  29: {
    textHindi: '1905 में बंगाल के विभाजन के समय भारत का वायसराय कौन था?',
    optionsHindi: {
      A: 'लॉर्ड कर्जन',
      B: 'लॉर्ड मिंटो',
      C: 'लॉर्ड रिपन',
      D: 'लॉर्ड हार्डिंग',
    },
    explanationHindi: '16 अक्टूबर 1905 को लॉर्ड कर्जन द्वारा बंगाल का विभाजन प्रभावी किया गया था। अतः विकल्प A।',
  },
  30: {
    textHindi: 'हड़प्पा सभ्यता का स्थल \'धोलावीरा\' भारत के किस राज्य में स्थित है?',
    optionsHindi: {
      A: 'राजस्थान',
      B: 'गुजरात',
      C: 'हरियाणा',
      D: 'पंजाब',
    },
    explanationHindi: 'धोलावीरा गुजरात के कच्छ के रण में स्थित यूनेस्को विश्व धरोहर स्थल है, जो अपनी उत्कृष्ट जल संरक्षण प्रणाली के लिए प्रसिद्ध है। अतः विकल्प B।',
  },

  // Quantitative Aptitude
  51: {
    textHindi: 'यदि (x + 1/x) = 5 है, तो (x³ + 1/x³) का मान ज्ञात कीजिए:',
    optionsHindi: {
      A: '110',
      B: '125',
      C: '140',
      D: '115',
    },
    explanationHindi: 'सूत्र: यदि x + 1/x = k, तो x³ + 1/x³ = k³ - 3k।\nयहाँ k = 5, इसलिए 5³ - 3(5) = 125 - 15 = 110। अतः विकल्प A।',
  },
  52: {
    textHindi: 'A किसी कार्य को 12 दिनों में पूरा कर सकता है और B उसी कार्य को 18 दिनों में पूरा कर सकता है। यदि वे एक साथ कार्य करते हैं, तो कार्य कितने दिनों में पूरा होगा?',
    optionsHindi: {
      A: '6 दिन',
      B: '7.2 दिन',
      C: '8 दिन',
      D: '7.5 दिन',
    },
    explanationHindi: 'कुल कार्य = LCM(12, 18) = 36 इकाई।\nA की कार्यक्षमता = 36/12 = 3 इकाई/दिन, B की कार्यक्षमता = 36/18 = 2 इकाई/दिन।\nएक साथ कार्यक्षमता = 5 इकाई/दिन। कुल समय = 36/5 = 7.2 दिन। अतः विकल्प B।',
  },
  53: {
    textHindi: 'एक वस्तु का अंकित मूल्य ₹800 है। दुकानदार 15% और 10% की दो क्रमागत छूट देता है। वस्तु का विक्रय मूल्य क्या है?',
    optionsHindi: {
      A: '₹600',
      B: '₹612',
      C: '₹624',
      D: '₹580',
    },
    explanationHindi: 'विक्रय मूल्य = 800 × (0.85) × (0.90) = 800 × 0.765 = ₹612। अतः विकल्प B।',
  },
  54: {
    textHindi: 'एक 240 मीटर लंबी रेलगाड़ी 72 किमी/घंटा की गति से चल रही है। यह 160 मीटर लंबे प्लेटफॉर्म को पार करने में कितना समय लेगी?',
    optionsHindi: {
      A: '18 सेकंड',
      B: '20 सेकंड',
      C: '22 सेकंड',
      D: '24 सेकंड',
    },
    explanationHindi: 'गति = 72 × (5/18) = 20 मी/से। कुल दूरी = 240 + 160 = 400 मीटर।\nसमय = 400 / 20 = 20 सेकंड। अतः विकल्प B।',
  },
  55: {
    textHindi: '₹12,000 की राशि पर 10% प्रति वर्ष की दर से 2 वर्ष का चक्रवृद्धि ब्याज क्या होगा, यदि ब्याज वार्षिक रूप से संयोजित होता है?',
    optionsHindi: {
      A: '₹2,400',
      B: '₹2,520',
      C: '₹2,640',
      D: '₹2,500',
    },
    explanationHindi: '2 वर्ष के लिए प्रभावी CI दर = 10 + 10 + (10×10)/100 = 21%।\nCI = 12000 का 21% = ₹2,520। अतः विकल्प B।',
  },
};

/**
 * Returns the localized text or bilingual representation
 */
export function getLocalizedQuestion(
  qId: number,
  originalText: string,
  sectionId: string,
  lang: 'en' | 'hi'
): { text: string; isBilingualAvailable: boolean } {
  if (sectionId === 'english') {
    return { text: originalText, isBilingualAvailable: false };
  }

  const hindiData = HINDI_QUESTION_MAP[qId];
  if (lang === 'hi' && hindiData?.textHindi) {
    return { text: hindiData.textHindi, isBilingualAvailable: true };
  }

  return { text: originalText, isBilingualAvailable: Boolean(hindiData?.textHindi) };
}

export function getLocalizedOption(
  qId: number,
  optionId: 'A' | 'B' | 'C' | 'D',
  originalText: string,
  sectionId: string,
  lang: 'en' | 'hi'
): string {
  if (sectionId === 'english') {
    return originalText;
  }

  const hindiData = HINDI_QUESTION_MAP[qId];
  if (lang === 'hi' && hindiData?.optionsHindi?.[optionId]) {
    return hindiData.optionsHindi[optionId];
  }

  return originalText;
}
