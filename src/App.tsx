import React, { useState, useCallback, useEffect } from 'react';
import { Tractor } from 'lucide-react';
import VoiceRecorder from './components/VoiceRecorder';
import ChatMessage from './components/ChatMessage';
import LanguageSelector from './components/LanguageSelector';
import { Message, Language } from './types';
import { initializeGemini, generateResponse } from './services/gemini';
import { speechToText, textToSpeech } from './services/speech';
import { getLanguageCode } from './utils/languageMapping';

const GEMINI_API_KEY = 'AIzaSyDSynDh4asJf6mcqtiEy2A5SG4UdX8wEIE';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>({
    code: 'hi',
    name: 'Hindi',
    localName: 'हिंदी',
  });

  useEffect(() => {
    initializeGemini(GEMINI_API_KEY);
  }, []);

  const handleRecordingComplete = useCallback(async () => {
    setIsProcessing(true);
    
    try {
      // Add user's message to show recording started
      const userMessage: Message = {
        content: '🎤 Recording...',
        type: 'user',
      };
      setMessages((prev) => [...prev, userMessage]);

      // 1. Convert speech to text
      const languageCode = getLanguageCode(selectedLanguage.code);
      const transcribedText = await speechToText(languageCode);
      
      // Update user message with transcribed text immediately
      setMessages((prev) => 
        prev.map((msg, idx) => 
          idx === prev.length - 1 
            ? { ...msg, content: transcribedText }
            : msg
        )
      );

      // 2. Generate response using Gemini
      const response = await generateResponse(transcribedText, selectedLanguage.code);

      // Add assistant's response immediately
      const assistantMessage: Message = {
        content: response,
        type: 'assistant',
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // 3. Convert response to speech in parallel
      textToSpeech(response, languageCode).catch(error => {
        console.error('Text-to-speech error:', error);
      });

    } catch (error) {
      console.error('Error processing voice message:', error);
      
      const errorMessages: { [key: string]: string } = {
        hi: 'क्षमा करें, आपका संदेश प्रोसेस करने में त्रुटि हुई। कृपया पुनः प्रयास करें।',
        mr: 'क्षमस्व, तुमचा संदेश प्रक्रिया करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
        pa: 'ਮੁਆਫ਼ ਕਰਨਾ, ਤੁਹਾਡਾ ਸੁਨੇਹਾ ਪ੍ਰੋਸੈਸ ਕਰਨ ਵਿੱਚ ਗਲਤੀ ਹੋਈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
        bn: 'দুঃখিত, আপনার বার্তা প্রক্রিয়া করতে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        te: 'క్షమించండి, మీ సందేశాన్ని ప్రాసెస్ చేయడంలో లోపం జరిగింది. దయచేసి మళ్ళీ ప్రయత్నించండి.',
      };

      const errorMessage: Message = {
        content: errorMessages[selectedLanguage.code] || errorMessages.hi,
        type: 'assistant',
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedLanguage]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tractor className="w-8 h-8" />
            <h1 className="text-2xl font-bold">किसान साथी</h1>
          </div>
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        </div>
      </header>

      <main className="container mx-auto max-w-4xl p-4">
        <div className="bg-gray-50 rounded-lg shadow-lg min-h-[70vh] p-4 mb-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
              <Tractor className="w-16 h-16 mb-4 text-green-500" />
              <p className="text-xl mb-2">आपका स्वागत है! (Welcome!)</p>
              <p className="text-sm">
                अपना सवाल पूछने के लिए नीचे माइक बटन दबाएं
                <br />
                Press the mic button below to ask your question
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <VoiceRecorder
            onRecordingComplete={handleRecordingComplete}
            isProcessing={isProcessing}
          />
        </div>
      </main>
    </div>
  );
}

export default App;