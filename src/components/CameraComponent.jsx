// components/CameraComponent.jsx
import React, { useEffect, useState } from 'react';
import './CameraComponent.css';

function CameraComponent() {
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Start camera automatically
    startCamera();
    
    // Clean up when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const videoElement = document.getElementById('camera');
      
      if (videoElement) {
        videoElement.srcObject = stream;
        setCameraActive(true);
        setError('');
        
        // Announce to screen readers that camera is now active
        const announceElement = document.getElementById('camera-status');
        if (announceElement) {
          announceElement.textContent = "Camera is now active and ready to use.";
        }
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError('Unable to access camera. Please check permissions.');
      setCameraActive(false);
      
      // Announce error to screen readers
      const announceElement = document.getElementById('camera-status');
      if (announceElement) {
        announceElement.textContent = "Error accessing camera. " + err.message;
      }
    }
  };

  const stopCamera = () => {
    const videoElement = document.getElementById('camera');
    if (videoElement && videoElement.srcObject) {
      const tracks = videoElement.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoElement.srcObject = null;
      setCameraActive(false);
    }
  };

  return (
    <div className="camera-container">
      <div 
        aria-live="polite" 
        id="camera-status" 
        className="sr-only"
      >
        {cameraActive ? 'Camera is active' : 'Camera is inactive'}
      </div>
      
      <video 
        id="camera" 
        autoPlay 
        playsInline 
        muted 
        aria-label="Live camera feed"
      />
      
      {error && (
        <div className="camera-error" role="alert">
          {error}
        </div>
      )}
      
      <div className="camera-controls">
        {!cameraActive ? (
          <button 
            onClick={startCamera}
            aria-label="Start camera"
            className="camera-button"
          >
            Start Camera
          </button>
        ) : (
          <button 
            onClick={stopCamera}
            aria-label="Stop camera"
            className="camera-button"
          >
            Stop Camera
          </button>
        )}
      </div>
    </div>
  );
}

export default CameraComponent;