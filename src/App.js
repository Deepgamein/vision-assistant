// This would be your main App.js file
import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import CameraComponent from './components/CameraComponent';
import ResultsArea from './components/ResultsArea';
import ControlPanel from './components/ControlPanel';
import KeyboardHandler from './components/KeyboardHandler';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [isContinuousMode, setIsContinuousMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechVoice, setSpeechVoice] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const continuousModeRef = useRef(false);
  const processingTimeoutRef = useRef(null);
  
  // Load available voices for speech synthesis
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
        setSpeechVoice(voices[0]);
      }
    };
    
    loadVoices();
    if ('onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  // Update the ref when the state changes
  useEffect(() => {
    continuousModeRef.current = isContinuousMode;
  }, [isContinuousMode]);

  const analyzeImage = async (imageData) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      // Replace with your API key and endpoint
      const API_KEY = 'your-api-key';
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Describe what you see in this image in detail, focusing on objects, people, text, and spatial relationships. Format the description to be helpful for a blind person." },
                { type: "image_url", image_url: { url: imageData } }
              ]
            }
          ],
          max_tokens: 300
        })
      });
      
      const data = await response.json();
      if (data.choices && data.choices[0]) {
        const description = data.choices[0].message.content;
        setResult(description);
        speakText(description);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      const errorMessage = "I'm sorry, I couldn't analyze the image. Please try again.";
      setResult(errorMessage);
      speakText(errorMessage);
    } finally {
      setIsProcessing(false);
      
      // If in continuous mode, schedule next capture
      if (continuousModeRef.current) {
        processingTimeoutRef.current = setTimeout(() => {
          const cameraElement = document.getElementById('camera');
          if (cameraElement) {
            captureAndAnalyze();
          }
        }, 5000); // Wait 5 seconds between captures
      }
    }
  };

  
  const captureAndAnalyze = () => {
    const video = document.getElementById('camera');
    const canvas = document.createElement('canvas');
    
    if (video && video.readyState === 4) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      analyzeImage(imageData);
    } else {
      speakText("Camera is not ready. Please try again.");
    }
  };

  const speakText = (text) => {
    if (window.speechSynthesis) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;
      
      if (speechVoice) {
        utterance.voice = speechVoice;
      }
      
      setIsSpeaking(true);
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleContinuousMode = () => {
    const newMode = !isContinuousMode;
    setIsContinuousMode(newMode);
    
    if (newMode) {
      speakText("Continuous mode activated. I will describe what I see every few seconds.");
      // Start the continuous capture after the announcement
      setTimeout(captureAndAnalyze, 2000);
    } else {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      speakText("Continuous mode deactivated.");
    }
  };

  const handleVoiceChange = (event) => {
    const selectedVoice = availableVoices.find(voice => voice.name === event.target.value);
    if (selectedVoice) {
      setSpeechVoice(selectedVoice);
    }
  };

  const handleRateChange = (event) => {
    setSpeechRate(parseFloat(event.target.value));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Vision Assistant</h1>
        <p>Helping you understand what's around you</p>
      </header>
      
      <main>
        <CameraComponent />
        
        <ControlPanel 
          isProcessing={isProcessing}
          isSpeaking={isSpeaking}
          isContinuousMode={isContinuousMode}
          captureAndAnalyze={captureAndAnalyze}
          stopSpeaking={stopSpeaking}
          toggleContinuousMode={toggleContinuousMode}
          speechRate={speechRate}
          handleRateChange={handleRateChange}
          availableVoices={availableVoices}
          handleVoiceChange={handleVoiceChange}
        />
        
        <ResultsArea result={result} />
      </main>
      
      <footer>
        <p>AI Vision Assistant - Build-a-thon Project</p>
      </footer>
      <KeyboardHandler
  captureAndAnalyze={captureAndAnalyze}
  stopSpeaking={stopSpeaking}
  toggleContinuousMode={toggleContinuousMode}
  isDisabled={isProcessing}
/>
    </div>
  );
}

export default App;