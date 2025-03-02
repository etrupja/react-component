import React, { useState, useEffect } from 'react';
import './InteractiveProgressBar.css';

// Types for the component props
export type Theme = 'space' | 'nature' | 'minimal';

export interface InteractiveProgressBarProps {
  // Progress can be a percentage (0-100) or current step
  progress?: number;
  // For step-based progress
  currentStep?: number;
  totalSteps?: number;
  // Visual theme
  theme?: Theme;
  // Whether to show confetti on completion
  showConfetti?: boolean;
  // Optional callback when progress reaches 100%
  onComplete?: () => void;
  // Width of the progress bar
  width?: string;
  // Height of the progress bar
  height?: string;
  // Animation duration in ms
  animationDuration?: number;
}

export const InteractiveProgressBar: React.FC<InteractiveProgressBarProps> = ({
  progress,
  currentStep,
  totalSteps = 1,
  theme = 'minimal',
  showConfetti = false,
  onComplete,
  width = '100%',
  height = '20px',
  animationDuration = 500,
}) => {
  // Calculate the percentage based on either direct progress or steps
  const [percentage, setPercentage] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [showCompletionEffect, setShowCompletionEffect] = useState<boolean>(false);

  useEffect(() => {
    let calculatedPercentage: number;
    
    if (progress !== undefined) {
      calculatedPercentage = Math.min(Math.max(progress, 0), 100);
    } else if (currentStep !== undefined && totalSteps > 0) {
      calculatedPercentage = Math.min(Math.max((currentStep / totalSteps) * 100, 0), 100);
    } else {
      calculatedPercentage = 0;
    }
    
    setPercentage(calculatedPercentage);
    
    // Check if progress is complete
    const complete = calculatedPercentage >= 100;
    if (complete && !isComplete) {
      setIsComplete(true);
      if (showConfetti) {
        setShowCompletionEffect(true);
      }
      if (onComplete) {
        onComplete();
      }
    } else if (!complete && isComplete) {
      setIsComplete(false);
      setShowCompletionEffect(false);
    }
  }, [progress, currentStep, totalSteps, isComplete, showConfetti, onComplete]);

  // Generate confetti elements
  const renderConfetti = () => {
    if (!showCompletionEffect) return null;
    
    return (
      <div className="confetti-container">
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i} 
            className="confetti" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
            }}
          />
        ))}
      </div>
    );
  };

  // Render the appropriate theme element
  const renderThemeElement = () => {
    switch (theme) {
      case 'space':
        return (
          <div 
            className="theme-element rocket" 
            style={{ 
              left: `${percentage - 5}%`,
              transition: `left ${animationDuration}ms ease-out`
            }}
          >
            🚀
          </div>
        );
      case 'nature':
        return (
          <div className="theme-element-container">
            {Array.from({ length: 5 }).map((_, i) => {
              const plantProgress = Math.min(percentage, (i + 1) * 20);
              const plantSize = plantProgress / 20;
              return (
                <div 
                  key={i} 
                  className="theme-element plant"
                  style={{ 
                    left: `${i * 20}%`,
                    transform: `scale(${plantSize})`,
                    opacity: plantSize,
                    transition: `transform ${animationDuration}ms ease-out, opacity ${animationDuration}ms ease-out`
                  }}
                >
                  🌱
                </div>
              );
            })}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={`interactive-progress-container theme-${theme}`}
      style={{ width, height }}
    >
      <div className="progress-track">
        <div 
          className="progress-fill"
          style={{ 
            width: `${percentage}%`,
            transition: `width ${animationDuration}ms ease-out`
          }}
        />
        {renderThemeElement()}
      </div>
      <div className="progress-text">{Math.round(percentage)}%</div>
      {renderConfetti()}
    </div>
  );
};

export default InteractiveProgressBar; 