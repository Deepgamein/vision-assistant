// components/ResultsArea.jsx
import React from 'react';
import './ResultsArea.css';

function ResultsArea({ result }) {
  return (
    <div className="results-area">
      <h2>Description</h2>
      
      <div 
        className="result-content"
        aria-live="polite" 
        aria-atomic="true"
      >
        {result ? (
          <p>{result}</p>
        ) : (
          <p className="placeholder">
            The description of what the camera sees will appear here.
            Press the "Analyze Image" button or use the space bar to analyze what's in front of the camera.
          </p>
        )}
      </div>
    </div>
  );
}

export default ResultsArea;