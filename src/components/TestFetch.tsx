import { useEffect, useState } from 'react';
import styles from './TestFetch.module.css';


interface Job {
  id: string;
  title: string;
  description?: string;
  status?: string;
}

interface Candidate {
  id: string;
  name: string;
  email?: string;
}

export default function JobsDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const [jobsRes, candidatesRes] = await Promise.all([
        fetch("/api/jobs"),
        fetch("/api/candidates")
      ]);
      if (!jobsRes.ok) throw new Error(`Jobs fetch failed: ${jobsRes.status}`);
      if (!candidatesRes.ok) throw new Error(`Candidates fetch failed: ${candidatesRes.status}`);

      const [jobsData, candidatesData] = await Promise.all([
        jobsRes.json(),
        candidatesRes.json()
      ]);

      setJobs(jobsData);
      setCandidates(candidatesData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createJob = async () => {
    try {
      const newJob = {
        id: Date.now().toString(),
        title: `New Job ${jobs.length + 1}`,
        description: 'This is a test job',
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await fetchData();
    } catch (err) {
      alert(`Failed to create job: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <div className={styles.loading}>Loading dashboard...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  const totalJobs = jobs.length;
  const openJobs = jobs.filter(j => j.status?.toLowerCase() === 'open').length;
  const closedJobs = jobs.filter(j => j.status?.toLowerCase() === 'closed').length;
  const totalCandidates = candidates.length;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <h2>Jobs Dashboard</h2>
        {lastUpdated && (
          <span className={styles.lastUpdated}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.total}`}>
          <span className={styles.statNumber}>{totalJobs}</span>
          <span className={styles.statLabel}>Total Jobs</span>
        </div>
        <div className={`${styles.statCard} ${styles.open}`}>
          <span className={styles.statNumber}>{openJobs}</span>
          <span className={styles.statLabel}>Open</span>
        </div>
        <div className={`${styles.statCard} ${styles.closed}`}>
          <span className={styles.statNumber}>{closedJobs}</span>
          <span className={styles.statLabel}>Closed</span>
        </div>
        <div className={`${styles.statCard} ${styles.candidates}`}>
          <span className={styles.statNumber}>{totalCandidates}</span>
          <span className={styles.statLabel}>Candidates</span>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.primaryBtn} onClick={createJob}>Create New Job</button>
        <button className={styles.secondaryBtn} onClick={fetchData}>Refresh Now</button>
      </div>

      {/* Job List */}
      <ul className={styles.cardGrid}>
        {jobs.map((job) => (
          <li key={job.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>{job.title}</h3>
              <small>ID: {job.id}</small>
            </div>
            {job.description && <p>{job.description}</p>}
            <p>Status: {job.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
