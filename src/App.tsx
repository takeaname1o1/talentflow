import { BrowserRouter, Routes, Route, Link, useLocation,NavLink } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import CandidatesPage from './pages/CandidatesPage';
import CandidateDetailPage from './pages/CandidateDetailPage';
import AssessmentsPage from './pages/AssessmentsPage';
import NotFoundPage from './pages/NotFoundPage';
import { useEffect, useState } from 'react';
import banner from './assets/banner.png'; // Import the banner image

// Component to display current URL
const CurrentUrlDisplay = () => {
  const location = useLocation();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(`${location.pathname}${location.search}${location.hash}`);
  }, [location]);

  return (
    <div className="current-url-display">
      <strong>Current Route:</strong>
      <code>{currentUrl}</code>
      <button
        onClick={() => navigator.clipboard.writeText(window.location.href)}
        className="copy-url-btn"
        title="Copy full URL to clipboard"
      >
        📋
      </button>
    </div>
  );
};

// Countdown timer component
const CountdownTimer = () => {
  useEffect(() => {
    const scriptId = 'tickcounter-sdk';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = "//www.tickcounter.com/static/js/loader.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <div className="countdown-container">
      <div className="countdown-header">
        <span className="countdown-label">⏳ Submission Deadline</span>
      </div>
      <a
        data-type="countdown"
        data-id="8137274"
        className="tickcounter"
        style={{
          display: 'block',
          width: '100%',
          height: '60px',
          position: 'relative',
          margin: '0 auto',
          textDecoration: 'none'
        }}
        title="Submission Countdown"
        href="//www.tickcounter.com/"
      >
        Loading countdown...
      </a>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
        
          
       
          
          <div className="header-content">
            <h1>TalentFlow</h1>
          </div>
          <CountdownTimer />
          <CurrentUrlDisplay />

    

<nav className="sidebar-nav">
  <NavLink to="/" className="nav-item">🏠 Dashboard</NavLink>
  <NavLink to="/jobs" className="nav-item">📋 Jobs</NavLink>
  <NavLink to="/candidates" className="nav-item">🧑‍💼 Candidates</NavLink>
  <NavLink to="/assessments" className="nav-item">📊 Assessments</NavLink>
</nav>

        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:jobId" element={<JobDetailPage />} />
            <Route path="/candidates" element={<CandidatesPage />} />
            <Route path="/candidates/:id" element={<CandidateDetailPage />} />
            <Route path="/assessments/" element={<AssessmentsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;