import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Job {
  id: string;
  title: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

const JobDetailPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch job: ${res.status} ${res.statusText}`);
        }

        const data: Job = await res.json();
        setJob(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) return <p>Loading job details...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div>
      <h1>{job.title}</h1>
      {job.description && <p>{job.description}</p>}
      {job.status && <p>Status: {job.status}</p>}
      {job.createdAt && (
        <p>Created: {new Date(job.createdAt).toLocaleString()}</p>
      )}
      {job.updatedAt && (
        <p>Updated: {new Date(job.updatedAt).toLocaleString()}</p>
      )}
    </div>
  );
};

export default JobDetailPage;
