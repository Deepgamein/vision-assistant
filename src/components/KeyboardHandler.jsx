// components/KeyboardHandler.jsx
import { useEffect } from 'react';

function KeyboardHandler({ 
  captureAndAnalyze, 
  stopSpeaking, 
  toggleContinuousMode, 
  isDisabled = false 
}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isDisabled) return;
      
      // Don't trigger shortcuts when typing in input fields
      if (
        event.target.tagName === 'INPUT' || 
        event.target.tagName === 'TEXTAREA' || 
        event.target.tagName === 'SELECT'
      ) {
        return;
      }
      
      switch (event.key.toLowerCase()) {
        case ' ':
          // Space bar - Analyze image
          event.preventDefault();
          captureAndAnalyze();
          break;
          
        case 'c':
          // C - Toggle continuous mode
          toggleContinuousMode();
          break;
          
        case 's':
          // S - Stop speaking
          stopSpeaking();
          break;
          
        default:
          // No action for other keys
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [captureAndAnalyze, stopSpeaking, toggleContinuousMode, isDisabled]);
  
  // This component doesn't render anything
  return null;
}

export default KeyboardHandler;