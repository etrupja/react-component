import React, { useState, useRef } from 'react';
import './MonkeyLoginForm.css';

interface MonkeyLoginFormProps {
  onSubmit: (username: string, password: string) => void;
}

const MonkeyLoginForm: React.FC<MonkeyLoginFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [eyesOpen, setEyesOpen] = useState(true);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const cursorPosition = useRef<number>(0);

  // Handle username input changes
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    
    // Update cursor position for eye tracking
    cursorPosition.current = e.target.selectionStart || newUsername.length;
    updateEyePosition(newUsername);
  };

  // Update eye position based on cursor position and input value
  const updateEyePosition = (text: string) => {
    if (!eyesOpen) return;
    
    const inputLength = text.length;
    const cursorPos = cursorPosition.current;
    
    // Base movement ranges
    const maxHorizontalMove = 8; // maximum horizontal pixels to move
    const maxVerticalMove = 4;   // reduced vertical movement since pupils start at bottom
    
    // Calculate position along a circular arc (bottom half of circle)
    // As typing progresses, eyes move from left to right along the bottom of an imaginary circle
    let horizontalRatio = 0;
    if (inputLength > 0) {
      // Map the cursor position to a value between 0 and 1
      horizontalRatio = Math.min(cursorPos / 20, 1); // Cap at 1 after 20 characters
    }
    
    // Calculate position on circular arc (bottom half of circle)
    // Using parametric equation for a circle, but only using the bottom half
    // x = r * cos(θ), y = r * sin(θ) where θ ranges from π to 2π (bottom half)
    // To move from left to right, we'll go from 2π to π (reverse direction)
    const angle = 2 * Math.PI - (horizontalRatio * Math.PI); // Map ratio to angle from 2π to π
    
    // Calculate coordinates on the circle
    // Positive cos for x gives left-to-right movement as angle decreases
    const newX = maxHorizontalMove * Math.cos(angle);
    const newY = -maxVerticalMove * Math.sin(angle); // Negative to move up from bottom
    
    // Add slight randomness for natural movement
    const randomX = (Math.random() * 0.3 - 0.15); // Small random adjustment
    const randomY = (Math.random() * 0.2 - 0.1);
    
    setEyePosition({ 
      x: newX + randomX, 
      y: newY + randomY 
    });
  };

  // Handle password input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Close eyes when typing password
    setEyesOpen(false);
  };

  // Handle password field focus/blur
  const handlePasswordFocus = () => {
    setEyesOpen(false);
  };

  const handlePasswordBlur = () => {
    setEyesOpen(true);
    // When returning from password field, update eye position based on username
    if (username) {
      updateEyePosition(username);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  // Handle username field focus
  const handleUsernameFocus = () => {
    setEyesOpen(true);
    updateEyePosition(username);
  };

  // Reset eye position when username field is not focused
  const handleUsernameBlur = () => {
    // Small delay to keep eyes in position briefly
    setTimeout(() => {
      if (document.activeElement !== usernameInputRef.current) {
        // Return eyes to center with slight randomness
        const randomX = (Math.random() * 2 - 1) * 2; // Random value between -2 and 2
        const randomY = (Math.random() * 1) * -0.5; // Small upward movement from bottom
        setEyePosition({ x: randomX, y: randomY });
      }
    }, 100);
  };

  // Add cursor position tracking for username field
  const handleUsernameKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (usernameInputRef.current) {
      cursorPosition.current = usernameInputRef.current.selectionStart || username.length;
      updateEyePosition(username);
    }
  };

  // Add mouse movement tracking for more natural eye behavior
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!eyesOpen || document.activeElement === usernameInputRef.current) return;
    
    // Only track mouse when not focused on username field
    if (formRef.current) {
      const rect = formRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from center of form
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);
      
      // Limit movement range
      const limitedX = Math.max(-1, Math.min(1, deltaX)) * 5;
      const limitedY = Math.max(-1, Math.min(1, deltaY)) * 3;
      
      setEyePosition({ x: limitedX, y: limitedY });
    }
  };

  // Add cursor tracking within the input field
  const handleInputMouseMove = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!eyesOpen || !usernameInputRef.current) return;
    
    // Only track mouse when focused on username field
    const inputRect = usernameInputRef.current.getBoundingClientRect();
    
    // Calculate relative position within the input field (0 to 1)
    const relativeX = (e.clientX - inputRect.left) / inputRect.width;
    
    // Map to our eye movement range
    const maxHorizontalMove = 8;
    const maxVerticalMove = 4; // reduced vertical movement
    
    // Calculate position on circular arc (bottom half of circle)
    // To move from left to right, we'll go from 2π to π (reverse direction)
    const angle = 2 * Math.PI - (relativeX * Math.PI); // Map ratio to angle from 2π to π
    
    // Calculate coordinates on the circle
    const newX = maxHorizontalMove * Math.cos(angle);
    const newY = -maxVerticalMove * Math.sin(angle); // Negative to move up from bottom
    
    setEyePosition({ x: newX, y: newY });
  };

  return (
    <div 
      className="monkey-login-container" 
      onMouseMove={handleMouseMove}
    >
      <div className="monkey">
        <div className="monkey-face">
          <div className="monkey-ears">
            <div className="ear left-ear"></div>
            <div className="ear right-ear"></div>
          </div>
          <div className="monkey-head">
            <div className="eyes">
              <div className="eye left-eye">
                <div 
                  className={`pupil ${eyesOpen ? 'open' : 'closed'}`}
                  style={{ 
                    transform: eyesOpen ? `translate(${eyePosition.x}px, ${eyePosition.y}px)` : 'none'
                  }}
                ></div>
              </div>
              <div className="eye right-eye">
                <div 
                  className={`pupil ${eyesOpen ? 'open' : 'closed'}`}
                  style={{ 
                    transform: eyesOpen ? `translate(${eyePosition.x}px, ${eyePosition.y}px)` : 'none'
                  }}
                ></div>
              </div>
            </div>
            <div className="nose"></div>
            <div className="mouth"></div>
          </div>
        </div>
      </div>

      <form className="login-form" onSubmit={handleSubmit} ref={formRef}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            onFocus={handleUsernameFocus}
            onBlur={handleUsernameBlur}
            onKeyUp={handleUsernameKeyUp}
            onClick={handleUsernameFocus}
            onMouseMove={handleInputMouseMove}
            ref={usernameInputRef}
            placeholder="Enter username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            placeholder="Enter password"
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default MonkeyLoginForm; 