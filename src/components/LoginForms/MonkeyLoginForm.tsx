import React, { useCallback, useEffect, useRef, useState } from 'react';
import './MonkeyLoginForm.css';

interface MonkeyLoginFormProps {
  onSubmit: (username: string, password: string) => void;
}

const MAX_PUPIL_OFFSET = 4; // px — how far pupils can travel from center
const SATURATION_DIST = 60; // px — target distance at which pupils hit max offset

/**
 * Compute the on-screen position of the text caret inside a single-line input.
 * Uses a reusable canvas to measure text width up to the caret.
 */
function makeCaretMeasurer() {
  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = null;
  return function caretScreenPos(input: HTMLInputElement): { x: number; y: number } {
    if (!ctx) {
      canvas = document.createElement('canvas');
      ctx = canvas.getContext('2d');
    }
    const rect = input.getBoundingClientRect();
    const cy = rect.top + rect.height / 2;
    if (!ctx) return { x: rect.left + 8, y: cy };

    const style = window.getComputedStyle(input);
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const value = input.type === 'password' ? '•'.repeat(input.value.length) : input.value;
    const pos = input.selectionStart ?? value.length;
    const width = ctx.measureText(value.slice(0, pos)).width;
    const padLeft = parseFloat(style.paddingLeft) || 0;
    const borderLeft = parseFloat(style.borderLeftWidth) || 0;
    const x = rect.left + borderLeft + padLeft + width - input.scrollLeft;
    return { x, y: cy };
  };
}

const MonkeyLoginForm: React.FC<MonkeyLoginFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [eyesOpen, setEyesOpen] = useState(true);
  const [blinking, setBlinking] = useState(false);

  const usernameInputRef = useRef<HTMLInputElement>(null);
  const leftPupilRef = useRef<HTMLDivElement>(null);
  const rightPupilRef = useRef<HTMLDivElement>(null);
  const usernameFocusedRef = useRef(false);
  const measureCaret = useRef(makeCaretMeasurer()).current;
  const lastTargetRef = useRef<{ x: number; y: number } | null>(null);

  // Per-eye target + current positions for the lerp loop
  const targetRef = useRef({ lx: 0, ly: 0, rx: 0, ry: 0 });
  const currentRef = useRef({ lx: 0, ly: 0, rx: 0, ry: 0 });
  const rafRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    const t = targetRef.current;
    const c = currentRef.current;
    // Left eye eases slightly slower than right — adds a tiny natural desync.
    const easeL = 0.22;
    const easeR = 0.25;
    c.lx += (t.lx - c.lx) * easeL;
    c.ly += (t.ly - c.ly) * easeL;
    c.rx += (t.rx - c.rx) * easeR;
    c.ry += (t.ry - c.ry) * easeR;

    if (leftPupilRef.current) {
      leftPupilRef.current.style.transform = `translate(${c.lx.toFixed(2)}px, ${c.ly.toFixed(2)}px)`;
    }
    if (rightPupilRef.current) {
      rightPupilRef.current.style.transform = `translate(${c.rx.toFixed(2)}px, ${c.ry.toFixed(2)}px)`;
    }

    const settled =
      Math.abs(t.lx - c.lx) < 0.04 &&
      Math.abs(t.ly - c.ly) < 0.04 &&
      Math.abs(t.rx - c.rx) < 0.04 &&
      Math.abs(t.ry - c.ry) < 0.04;

    if (settled) {
      // Snap to target so a stopped pupil sits exactly where it should.
      c.lx = t.lx;
      c.ly = t.ly;
      c.rx = t.rx;
      c.ry = t.ry;
      if (leftPupilRef.current) leftPupilRef.current.style.transform = `translate(${c.lx}px, ${c.ly}px)`;
      if (rightPupilRef.current) rightPupilRef.current.style.transform = `translate(${c.rx}px, ${c.ry}px)`;
      rafRef.current = null;
    } else {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  const ensureLoop = useCallback(() => {
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  /** Aim each pupil independently at a screen coordinate (sets targets, kicks the loop). */
  const lookAt = useCallback(
    (screenX: number, screenY: number) => {
      lastTargetRef.current = { x: screenX, y: screenY };
      const eyes = [
        { ref: leftPupilRef, kx: 'lx' as const, ky: 'ly' as const },
        { ref: rightPupilRef, kx: 'rx' as const, ky: 'ry' as const },
      ];
      const t = targetRef.current;
      for (const { ref, kx, ky } of eyes) {
        const pupil = ref.current;
        const eye = pupil?.parentElement;
        if (!pupil || !eye) continue;
        const r = eye.getBoundingClientRect();
        const dx = screenX - (r.left + r.width / 2);
        const dy = screenY - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy);
        if (dist < 1) {
          t[kx] = 0;
          t[ky] = 0;
          continue;
        }
        const angle = Math.atan2(dy, dx);
        const magnitude = Math.min(dist / SATURATION_DIST, 1) * MAX_PUPIL_OFFSET;
        t[kx] = Math.cos(angle) * magnitude;
        t[ky] = Math.sin(angle) * magnitude;
      }
      ensureLoop();
    },
    [ensureLoop]
  );

  const resetPupils = useCallback(() => {
    targetRef.current = { lx: 0, ly: 0, rx: 0, ry: 0 };
    lastTargetRef.current = null;
    ensureLoop();
  }, [ensureLoop]);

  // Cancel the lerp loop on unmount
  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  /** Re-aim at the username input's caret. */
  const lookAtCaret = useCallback(() => {
    const input = usernameInputRef.current;
    if (!input) return;
    const { x, y } = measureCaret(input);
    lookAt(x, y);
  }, [lookAt, measureCaret]);

  // Global mouse tracking when not focused on the username input
  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!eyesOpen || usernameFocusedRef.current) return;
      lookAt(e.clientX, e.clientY);
    }
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [eyesOpen, lookAt]);

  // Reset pupils whenever eyes close so the closed slit is centered
  useEffect(() => {
    if (!eyesOpen) resetPupils();
  }, [eyesOpen, resetPupils]);

  // Idle blink every 4–7 seconds while eyes are open
  useEffect(() => {
    if (!eyesOpen) return;
    let cancelled = false;
    function schedule() {
      const delay = 4000 + Math.random() * 3000;
      window.setTimeout(() => {
        if (cancelled) return;
        setBlinking(true);
        window.setTimeout(() => {
          if (cancelled) return;
          setBlinking(false);
          schedule();
        }, 120);
      }, delay);
    }
    schedule();
    return () => {
      cancelled = true;
    };
  }, [eyesOpen]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    requestAnimationFrame(lookAtCaret);
  };

  const handleUsernameFocus = () => {
    usernameFocusedRef.current = true;
    setEyesOpen(true);
    requestAnimationFrame(lookAtCaret);
  };

  const handleUsernameBlur = () => {
    usernameFocusedRef.current = false;
    // If a pointer hasn't moved yet, recenter; otherwise the next pointermove takes over.
    if (lastTargetRef.current === null) resetPupils();
  };

  const handleUsernameKeyUp = () => lookAtCaret();
  const handleUsernameClick = () => lookAtCaret();
  const handleUsernameSelect = () => lookAtCaret();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordFocus = () => {
    usernameFocusedRef.current = false;
    setEyesOpen(false);
  };

  const handlePasswordBlur = () => {
    setEyesOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  const pupilClass = `pupil ${eyesOpen && !blinking ? 'open' : 'closed'}`;

  return (
    <div className="monkey-login-container">
      <div className="monkey">
        <div className="monkey-face">
          <div className="monkey-ears">
            <div className="ear left-ear"></div>
            <div className="ear right-ear"></div>
          </div>
          <div className="monkey-head">
            <div className="eyes">
              <div className="eye left-eye">
                <div ref={leftPupilRef} className={pupilClass}></div>
              </div>
              <div className="eye right-eye">
                <div ref={rightPupilRef} className={pupilClass}></div>
              </div>
            </div>
            <div className="nose"></div>
            <div className="mouth"></div>
          </div>
        </div>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
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
            onClick={handleUsernameClick}
            onSelect={handleUsernameSelect}
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
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default MonkeyLoginForm;
