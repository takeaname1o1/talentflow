import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './JobDetail.module.css';

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
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) throw new Error(`Failed to fetch job: ${res.statusText}`);

        const data: Job = await res.json();
        setJob(data);
        setTitle(data.title);
        setDescription(data.description || '');
        setStatus(data.status || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleDelete = async () => {
    if (!jobId) return;
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Failed to delete job: ${res.statusText}`);
      navigate('/jobs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during deletion');
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdate = async () => {
    if (!jobId) return;

    try {
      setUpdating(true);
      setError(null);

      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, status }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update job');
      }

      const updatedJob: Job = await res.json();
      setJob(updatedJob);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during update');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Loading job details...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Edit Job</h1>

      <div className={styles.formGroup}>
        <label className={styles.label}>Title</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
          className={styles.textarea}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Status</label>
        <input
          value={status}
          onChange={e => setStatus(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.actions}>
        <button
          onClick={handleUpdate}
          disabled={updating}
          className={styles.updateButton}
        >
          {updating ? 'Updating...' : 'Update Job'}
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className={styles.deleteButton}
        >
          {deleting ? 'Deleting...' : 'Delete Job'}
        </button>
      </div>
    </div>
  );
};

export default JobDetailPage;
