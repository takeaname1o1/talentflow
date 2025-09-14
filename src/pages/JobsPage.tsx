import { useEffect, useState } from 'react';
import styles from './JobsPage.module.css';

export interface Job {
  id: string;
  title: string;
  description?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTitle, setSearchTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'box'>('list');
  const jobsPerPage = 5;

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data: Job[] = await response.json();
        setJobs(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter and sort jobs
  useEffect(() => {
    let filtered = jobs.filter((job) => {
      const matchesTitle = job.title.toLowerCase().includes(searchTitle.toLowerCase());
      const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
      return matchesTitle && matchesStatus;
    });

    filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [searchTitle, filterStatus, sortOrder, jobs]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const handleClearFilters = () => {
    setSearchTitle('');
    setFilterStatus('all');
    setSortOrder('newest');
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'open': return 'green';
      case 'closed': return 'gray';
      case 'pending': return 'orange';
      default: return 'black';
    }
  };

  return (
    <div className={styles.container}>
      <h1>Jobs Page</h1>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="pending">Pending</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        <select value={viewMode} onChange={(e) => setViewMode(e.target.value as 'list' | 'box')}>
          <option value="list">List View</option>
          <option value="box">Box View</option>
        </select>
        <button onClick={handleClearFilters}>Clear Filters</button>
      </div>

      {/* Render States */}
      {loading && <p>Loading jobs...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && filteredJobs.length === 0 && <p>No jobs match your filters.</p>}

      {!loading && !error && filteredJobs.length > 0 && (
        <>
          <div className={viewMode === 'box' ? styles.cardGrid : undefined}>


            {paginatedJobs.map((job, index) => (
              <div key={job.id} className={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>
                    {(currentPage - 1) * jobsPerPage + index + 1}. {job.title}
                  </strong>
                  <small style={{ color: '#666' }}>ID: {job.id}</small>
                  {job.status && (
                    <span
                      className={`${styles.statusBadge} ${styles[`status${job.status.charAt(0).toUpperCase() + job.status.slice(1)}`]}`}
                    >
                      {job.status}
                    </span>
                  )}
                </div>
                <small>
                  {job.createdAt && `Created: ${new Date(job.createdAt).toLocaleDateString()}`}<br />
                  {job.updatedAt && `Updated: ${new Date(job.updatedAt).toLocaleDateString()}`}
                </small>
              </div>
            ))}





          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default JobsPage;
