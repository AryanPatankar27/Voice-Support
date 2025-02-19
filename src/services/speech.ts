export const speechToText = (language: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      reject(new Error('Speech recognition not supported in this browser'));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let finalTranscript = '';
    let silenceTimer: NodeJS.Timeout;
    const SILENCE_DURATION = 1500; // 1.5 seconds of silence to detect end of speech

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      finalTranscript = transcript;
      
      // Clear and reset silence timer
      clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => {
        recognition.stop();
        resolve(finalTranscript);
      }, SILENCE_DURATION);
    };

    recognition.onerror = (event) => {
      reject(new Error(`Speech recognition error: ${event.error}`));
    };

    recognition.onend = () => {
      if (finalTranscript) {
        resolve(finalTranscript);
      } else {
        reject(new Error('No speech detected'));
      }
    };

    recognition.start();
  });
};

export const textToSpeech = async (text: string, language: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9; // Slightly slower rate for better clarity
    utterance.pitch = 1.0; // Natural pitch
    
    // Split long responses into sentences for better speech synthesis
    const sentences = text.split(/[।.!?]/).filter(Boolean);
    let currentIndex = 0;

    utterance.onend = () => {
      currentIndex++;
      if (currentIndex < sentences.length) {
        const nextUtterance = new SpeechSynthesisUtterance(sentences[currentIndex]);
        nextUtterance.lang = language;
        nextUtterance.rate = 0.9;
        nextUtterance.pitch = 1.0;
        window.speechSynthesis.speak(nextUtterance);
      } else {
        resolve();
      }
    };

    utterance.onerror = (event) => {
      reject(new Error(`Speech synthesis error: ${event.error}`));
    };

    // Start showing the text response immediately
    utterance.text = sentences[0];
    window.speechSynthesis.speak(utterance);
  });
};