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
    // Show only path and query parameters (more relevant for routing)
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

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <h1>TalentFlow - Test Mode</h1>
          <p>Mock API with Local Persistence (IndexedDB)</p>
          
          {/* Display current URL */}
          <CurrentUrlDisplay />
          
          {/* Navigation Buttons */}
          <nav className="navigation-buttons">
            <Link to="/" className="nav-button">
              <button>Home (Test Fetch)</button>
            </Link>
            <Link to="/jobs" className="nav-button">
              <button>Jobs Page</button>
            </Link>
            <Link to="/jobs/123" className="nav-button">
              <button>Job Detail (ID: 123)</button>
            </Link>
            <Link to="/candidates" className="nav-button">
              <button>Candidates Page</button>
            </Link>
            <Link to="/candidates/abc" className="nav-button">
              <button>Candidate Detail (ID: abc)</button>
            </Link>
            <Link to="/assessments/456" className="nav-button">
              <button>Assessments (Job ID: 456)</button>
            </Link>
            <Link to="/invalid-route" className="nav-button">
              <button>Test 404 Page</button>
            </Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={
              <div>
                <TestFetch />
              </div>
            } />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:jobId" element={<JobDetailPage />} />
            <Route path="/candidates" element={<CandidatesPage />} />
            <Route path="/candidates/:id" element={<CandidateDetailPage />} />
            <Route path="/assessments/:jobId" element={<AssessmentsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;