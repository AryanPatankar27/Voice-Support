import React from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const languages: Language[] = [
  { code: 'hi', name: 'Hindi', localName: 'हिंदी' },
  { code: 'mr', name: 'Marathi', localName: 'मराठी' },
  { code: 'pa', name: 'Punjabi', localName: 'ਪੰਜਾਬੀ' },
  { code: 'bn', name: 'Bengali', localName: 'বাংলা' },
  { code: 'te', name: 'Telugu', localName: 'తెలుగు' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="language" className="text-sm text-gray-600">
        भाषा / Language:
      </label>
      <select
        id="language"
        value={selectedLanguage.code}
        onChange={(e) => {
          const lang = languages.find((l) => l.code === e.target.value);
          if (lang) onLanguageChange(lang);
        }}
        className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.localName} ({lang.name})
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;