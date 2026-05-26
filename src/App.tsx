import React from 'react';
import './App.css';
import { MonkeyLoginForm } from './components/LoginForms';
import { useTheme } from './hooks/useTheme';
import ComponentShowcase from './components/ComponentShowcase';

import monkeyLoginSource from './components/LoginForms/MonkeyLoginForm.tsx?raw';
import monkeyLoginUsage from './components/LoginForms/MonkeyLoginForm.usage.md?raw';

import InteractiveProgressBarDemo from './components/InteractiveProgressBar/InteractiveProgressBar.demo';
import progressBarSource from './components/InteractiveProgressBar/InteractiveProgressBar.tsx?raw';
import progressBarUsage from './components/InteractiveProgressBar/InteractiveProgressBar.usage.md?raw';

import GrumpyFormValidator, {
  metadata as grumpyMetadata,
} from './components/GrumpyFormValidator';
import grumpySource from './components/GrumpyFormValidator/index.tsx?raw';
import grumpyUsage from './components/GrumpyFormValidator/GrumpyFormValidator.usage.md?raw';

import TrustFallButton, {
  metadata as trustFallMetadata,
} from './components/TrustFallButton';
import trustFallSource from './components/TrustFallButton/index.tsx?raw';
import trustFallUsage from './components/TrustFallButton/TrustFallButton.usage.md?raw';

const monkeyLoginMetadata = {
  name: 'Monkey Login Form',
  description: 'An animated monkey-themed login form with interactive elements.',
  category: 'Forms',
  tags: ['form', 'login', 'animation', 'svg'],
};

const progressBarMetadata = {
  name: 'Interactive Progress Bar',
  description: 'A customizable progress bar with multiple themes and confetti celebration.',
  category: 'Feedback',
  tags: ['progress', 'animation', 'confetti', 'theme'],
};

function App() {
  const { theme: appTheme, toggle: toggleTheme } = useTheme();

  return (
    <div className="App">
      <header className="App-header">
        <nav className="nav-left">
          <span className="nav-brand">RCS</span>
          <a href="#components" className="nav-link">
            Components
          </a>
          <a href="#docs" className="nav-link">
            Docs
          </a>
          <a href="#about" className="nav-link">
            About
          </a>
        </nav>
        <div className="nav-right">
          <div className="nav-text">
            <h3>React Component Showcase</h3>
            <p>A collection of interactive React components</p>
          </div>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${appTheme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${appTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {appTheme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </header>

      <div className="component-showcase">
        <ComponentShowcase
          component={MonkeyLoginForm}
          componentProps={{
            onSubmit: (username: string, password: string) =>
              console.log('Login attempt:', { username, password }),
          }}
          source={monkeyLoginSource}
          usage={monkeyLoginUsage}
          metadata={monkeyLoginMetadata}
        />

        <ComponentShowcase
          component={InteractiveProgressBarDemo}
          source={progressBarSource}
          usage={progressBarUsage}
          metadata={progressBarMetadata}
        />

        <ComponentShowcase
          component={GrumpyFormValidator}
          source={grumpySource}
          usage={grumpyUsage}
          metadata={grumpyMetadata}
        />

        <ComponentShowcase
          component={TrustFallButton}
          componentProps={{
            onConfirm: () => console.log('Trust fall confirmed'),
          }}
          source={trustFallSource}
          usage={trustFallUsage}
          metadata={trustFallMetadata}
        />
      </div>
    </div>
  );
}

export default App;
