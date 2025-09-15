import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import TestFetch from './components/TestFetch';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import CandidatesPage from './pages/CandidatesPage';
import CandidateDetailPage from './pages/CandidateDetailPage';
import AssessmentsPage from './pages/AssessmentsPage';
import NotFoundPage from './pages/NotFoundPage';
import { useEffect, useState } from 'react';

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

// New component for the countdown timer
// New component for the countdown timer
const CountdownTimer = () => {
  useEffect(() => {
    const scriptId = 'tickcounter-sdk';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = "//www.tickcounter.com/static/js/loader.js";
    script.async = true;
    document.body.appendChild(script);

    // This is the cleanup function that runs when the component unmounts
    return () => {
      const existingScript = document.getElementById(scriptId);
      // ✅ FIX: Use the variable by uncommenting this block
      if (existingScript) {
        // This is good practice to prevent memory leaks if the component unmounts
        existingScript.remove();
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div className="countdown-container">
      <a
        data-type="countdown"
        data-id="8137274"
        className="tickcounter"
        style={{
          display: 'block',
          left: 0,
          width: '100%',
          height: 0,
          position: 'relative',
          paddingBottom: '25%',
          margin: '0 auto'
        }}
        title="Submission"
        href="//www.tickcounter.com/"
      >
        Submission
      </a>
    </div>
  );
};


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          {/* Timer is now first for semantic clarity, but CSS will position it */}
          <CountdownTimer />

          {/* Wrapper for centered title content */}
          <div className="header-content">
            <h1>TalentFlow - Test Mode</h1>
            <p>Mock API with Local Persistence (IndexedDB)</p>
          </div>

          <CurrentUrlDisplay />

          <nav className="navigation-buttons">
            <Link to="/" className="nav-button">
              <button>🏠 Home (Test Fetch)</button>
            </Link>
            <Link to="/jobs" className="nav-button">
              <button>📋 Jobs</button>
            </Link>
            <Link to="/candidates" className="nav-button">
              <button>🧑‍💼 Candidates</button>
            </Link>

            {/* Assessments by Job ID */}
            <Link to="/assessments/456" className="nav-button">
              <button>📝 Assessments for Job 456</button>
            </Link>
            <Link to="/assessments/789" className="nav-button">
              <button>📝 Assessments for Job 789</button>
            </Link>
            <Link to="/assessments/000" className="nav-button">
              <button>📝 Assessments for Nonexistent Job</button>
            </Link>

            {/* Optional: All assessments view */}
            <Link to="/assessments" className="nav-button">
              <button>📊 All Assessments (if supported)</button>
            </Link>

            {/* Job and Candidate Detail */}
            <Link to="/jobs/456" className="nav-button">
              <button>🔍 View Job 456</button>
            </Link>
            <Link to="/candidates/123" className="nav-button">
              <button>🔎 View Candidate 123</button>
            </Link>

            {/* 404 Test */}
            <Link to="/invalid-route" className="nav-button">
              <button>🚫 Test 404 Page</button>
            </Link>
          </nav>



        </header>
        <main>
          <Routes>
            {/* Home */}
            <Route path="/" element={<TestFetch />} />

            {/* Jobs */}
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:jobId" element={<JobDetailPage />} />

            {/* Candidates */}
            <Route path="/candidates" element={<CandidatesPage />} />
            <Route path="/candidates/:id" element={<CandidateDetailPage />} />

            {/* Assessments */}
            <Route path="/assessments/" element={<AssessmentsPage />} />
            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;