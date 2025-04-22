// components/ControlPanel.jsx
import React from 'react';
import './ControlPanel.css';

function ControlPanel({
  isProcessing,
  isSpeaking,
  isContinuousMode,
  captureAndAnalyze,
  stopSpeaking,
  toggleContinuousMode,
  speechRate,
  handleRateChange,
  availableVoices,
  handleVoiceChange
}) {
  return (
    <div className="control-panel">
      <div className="main-controls">
        <button
          onClick={captureAndAnalyze}
          disabled={isProcessing || isContinuousMode}
          className="control-button primary"
          aria-label="Analyze what's in front of the camera"
        >
          {isProcessing ? 'Analyzing...' : 'Analyze Image'}
        </button>
        
        <button
          onClick={stopSpeaking}
          disabled={!isSpeaking}
          className="control-button"
          aria-label="Stop speaking"
        >
          Stop Speaking
        </button>
        
        <button
          onClick={toggleContinuousMode}
          className={`control-button ${isContinuousMode ? 'active' : ''}`}
          aria-pressed={isContinuousMode}
          aria-label="Toggle continuous analysis mode"
        >
          {isContinuousMode ? 'Stop Continuous Mode' : 'Start Continuous Mode'}
        </button>
      </div>
      
      <div className="settings">
        <div className="setting-group">
          <label htmlFor="speech-rate">
            Speech Rate: {speechRate}x
          </label>
          <input
            type="range"
            id="speech-rate"
            min="0.5"
            max="2"
            step="0.1"
            value={speechRate}
            onChange={handleRateChange}
            aria-label="Adjust speech rate"
          />
        </div>
        
        {availableVoices.length > 0 && (
          <div className="setting-group">
            <label htmlFor="voice-select">
              Voice:
            </label>
            <select
              id="voice-select"
              onChange={handleVoiceChange}
              aria-label="Select voice"
            >
              {availableVoices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      <div className="keyboard-shortcuts" aria-label="Keyboard shortcuts">
        <h3>Keyboard Shortcuts:</h3>
        <ul>
          <li><kbd>Space</kbd>: Analyze Image</li>
          <li><kbd>C</kbd>: Toggle Continuous Mode</li>
          <li><kbd>S</kbd>: Stop Speaking</li>
        </ul>
      </div>
    </div>
  );
}

export default ControlPanel;