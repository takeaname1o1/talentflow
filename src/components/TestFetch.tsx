import { useEffect, useState } from 'react';

interface Job {
  id: string;
  title: string;
  description?: string;
  status?: string;
}

export default function TestFetch() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/jobs");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error("Fetch error:", err);
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newJob),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdJob = await response.json();
      setJobs(prev => [...prev, createdJob]);
      alert('Job created successfully!');
    } catch (err) {
      alert(`Failed to create job: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Jobs</h2>
      <button onClick={createJob} style={{ marginBottom: '20px' }}>
        Create New Job
      </button>
      <button onClick={fetchJobs} style={{ marginBottom: '20px', marginLeft: '10px' }}>
        Refresh Jobs
      </button>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <p>Status: {job.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}