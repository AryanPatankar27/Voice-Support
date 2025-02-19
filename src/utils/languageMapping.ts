interface LanguageConfig {
  speech: string;
  bcp47: string;
  geminiName: string;
}

const languageMappings: { [key: string]: LanguageConfig } = {
  hi: {
    speech: 'hi-IN',
    bcp47: 'hi-IN',
    geminiName: 'हिंदी'
  },
  mr: {
    speech: 'mr-IN',
    bcp47: 'mr-IN',
    geminiName: 'मराठी'
  },
  pa: {
    speech: 'pa-IN',
    bcp47: 'pa-IN',
    geminiName: 'ਪੰਜਾਬੀ'
  },
  bn: {
    speech: 'bn-IN',
    bcp47: 'bn-IN',
    geminiName: 'বাংলা'
  },
  te: {
    speech: 'te-IN',
    bcp47: 'te-IN',
    geminiName: 'తెలుగు'
  }
};

export const getLanguageCode = (language: string): string => {
  return languageMappings[language]?.speech || 'hi-IN';
};

export const getGeminiLanguageName = (language: string): string => {
  return languageMappings[language]?.geminiName || 'हिंदी';
};