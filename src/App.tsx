import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { MonkeyLoginForm } from './components/LoginForms';
import { InteractiveProgressBar } from './components/InteractiveProgressBar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState<'space' | 'nature' | 'minimal'>('space');
  const [showConfetti, setShowConfetti] = useState(true);

  const handleLogin = (username: string, password: string) => {
    // In a real app, you would validate credentials here
    console.log('Login attempt:', { username, password });
    setIsLoggedIn(true);
    setUsername(username);
  };

  // Simulate progress increase
  useEffect(() => {
    if (isLoggedIn && progress < 100) {
      const timer = setTimeout(() => {
        setProgress(prev => Math.min(prev + 5, 100));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, progress]);

  // Handle theme change
  const handleThemeChange = (newTheme: 'space' | 'nature' | 'minimal') => {
    setTheme(newTheme);
    // Reset progress when theme changes
    setProgress(0);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Component Showcase</h1>
        <p>A collection of interactive React components</p>
      </header>
      
      <div className="component-showcase">
        {/* Monkey Login Form Component Card */}
        <div className="component-card">
          <h2>Monkey Login Form</h2>
          <div className="component-demo">
            <MonkeyLoginForm onSubmit={(username, password) => {
              console.log('Login attempt:', { username, password });
            }} />
          </div>
          <div className="component-description">
            <p>An animated monkey-themed login form with interactive elements.</p>
          </div>
        </div>

        {/* Interactive Progress Bar Component Card */}
        <div className="component-card">
          <h2>Interactive Progress Bar</h2>
          <div className="component-demo">
            <div className="theme-selector">
              <button 
                className={`theme-button ${theme === 'space' ? 'active' : ''}`}
                onClick={() => handleThemeChange('space')}
              >
                Space Theme 🚀
              </button>
              <button 
                className={`theme-button ${theme === 'nature' ? 'active' : ''}`}
                onClick={() => handleThemeChange('nature')}
              >
                Nature Theme 🌱
              </button>
              <button 
                className={`theme-button ${theme === 'minimal' ? 'active' : ''}`}
                onClick={() => handleThemeChange('minimal')}
              >
                Minimal Theme ⚡
              </button>
            </div>
            
            <div className="confetti-toggle">
              <label>
                <input 
                  type="checkbox" 
                  checked={showConfetti} 
                  onChange={() => setShowConfetti(!showConfetti)}
                />
                Show Confetti on Completion
              </label>
            </div>
            
            <InteractiveProgressBar 
              progress={progress} 
              theme={theme}
              showConfetti={showConfetti}
              onComplete={() => console.log('Progress complete!')}
              width="100%"
              height="30px"
            />
            
            <div className="progress-controls">
              <button 
                onClick={() => setProgress(0)}
                disabled={progress === 0}
              >
                Reset
              </button>
              <button 
                onClick={() => setProgress(prev => Math.min(prev + 10, 100))}
                disabled={progress === 100}
              >
                Increase +10%
              </button>
              <button 
                onClick={() => setProgress(100)}
                disabled={progress === 100}
              >
                Complete
              </button>
            </div>
          </div>
          <div className="component-description">
            <p>A customizable progress bar with multiple themes and confetti celebration.</p>
          </div>
        </div>


        {/* Add more component cards here as you create them */}
      </div>
    </div>
  );
}

export default App;
