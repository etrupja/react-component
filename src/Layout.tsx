import React, { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import ReSlugBanner from './components/promo/ReSlugBanner';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link is-active' : 'nav-link';

export default function Layout() {
  const { theme: appTheme, toggle: toggleTheme } = useTheme();

  return (
    <div className="App">
      <ScrollToTop />
      <ReSlugBanner />
      <header className="App-header">
        <nav className="nav-left">
          <NavLink to="/" className="nav-brand" aria-label="React Component Showcase home">
            RCS
          </NavLink>
          <NavLink to="/" end className={navClass}>
            Components
          </NavLink>
          <NavLink to="/docs" className={navClass}>
            Docs
          </NavLink>
          <NavLink to="/about" className={navClass}>
            About
          </NavLink>
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

      <Outlet />
    </div>
  );
}
