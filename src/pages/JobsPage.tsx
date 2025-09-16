import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export interface Job {
  id: string
  title: string
  description?: string
  status?: string
  createdAt?: Date
  updatedAt?: Date
}

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter and Sort State
  const [searchTitle, setSearchTitle] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  // UI State
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'list' | 'box'>('list')
  const jobsPerPage = 6

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs')
        if (!response.ok) throw new Error(`Error: ${response.statusText}`)
        const data: Job[] = await response.json()
        setJobs(data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch jobs')
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  useEffect(() => {
    const filtered = jobs
      .filter(job => {
        const matchesTitle = job.title.toLowerCase().includes(searchTitle.toLowerCase())
        const matchesStatus = filterStatus === 'all' || job.status === filterStatus
        return matchesTitle && matchesStatus
      })
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
      })

    setFilteredJobs(filtered)
    setCurrentPage(1)
  }, [searchTitle, filterStatus, sortOrder, jobs])

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  )

  const handleClearFilters = () => {
    setSearchTitle('')
    setFilterStatus('all')
    setSortOrder('newest')
  }

  // --- Action Handlers for Buttons ---
  const handleEdit = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation(); // Prevent event bubbling
    navigate(`/jobs/${jobId}`);
  };

  const handleArchive = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to archive job ${jobId}?`)) {
      alert(`Archiving job ${jobId}`);
      // In a real app, you would make an API call to update the job's status.
      // On success, you might want to refetch or update the state.
    }
  };

  const handleDelete = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to PERMANENTLY DELETE job ${jobId}?`)) {
      // Optimistic UI update: remove the job from the list immediately
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      // In a real app, you would follow up with a DELETE request to your API.
      alert(`Deleting job ${jobId}`);
    }
  };

  const getStatusClass = (status?: string): string => {
    switch (status) {
      case 'open': return 'badge-success'
      case 'closed': return 'badge-secondary'
      case 'pending': return 'badge-warning'
      case 'archived': return 'badge'
      default: return 'badge'
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Jobs</h2>
        {/* The duplicate "Archive" button has been removed for clarity */}
        <Link to="/jobs/new" className="btn btn-primary">
          Create New Job
        </Link>
      </div>

      <div className="filters-bar">
        {/* Filter inputs remain the same */}
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTitle}
          onChange={e => setSearchTitle(e.target.value)}
          className="form-input"
        />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="form-select">
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="pending">Pending</option>
          <option value="archived">Archived</option>
        </select>
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value as 'newest' | 'oldest')} className="form-select">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        <select value={viewMode} onChange={e => setViewMode(e.target.value as 'list' | 'box')} className="form-select">
          <option value="list">List View</option>
          <option value="box">Box View</option>
        </select>
        <button onClick={handleClearFilters} className="btn btn-outline">Clear</button>
      </div>

      <div className="card-body">
        {loading && <p>Loading jobs...</p>}
        {error && <div className="alert alert-danger">Error: {error}</div>}
        {!loading && !error && filteredJobs.length === 0 && (
          <div className="alert">No jobs match your filters.</div>
        )}

        {!loading && !error && filteredJobs.length > 0 && (
          <div className={viewMode === 'box' ? 'grid-view' : 'list-view'}>
            {paginatedJobs.map((job) => (
              // The outer element is now a div instead of a Link
              <div key={job.id} className="job-item-card">
                <div className="job-item-header">
                  {/* The title is now the link */}
                  <Link to={`/jobs/${job.id}`} className="job-item-title-link">
                    <h3>{job.title}</h3>
                  </Link>
                  {job.status && (
                    <span className={`badge ${getStatusClass(job.status)}`}>
                      {job.status}
                    </span>
                  )}
                </div>
                <div className="job-item-body">
                  <p className="text-secondary">
                    {job.description ? `${job.description.substring(0, 100)}...` : 'No description available.'}
                  </p>
                </div>

                
                  <div className="job-item-footer">
                    {/* Meta-info like ID and date */}
                    <div className="job-item-meta">
                    <small>ID: {job.id}</small>
                    <small>
                      {job.createdAt && `Created: ${new Date(job.createdAt).toLocaleDateString()}`}
                    </small>
                    </div>
                    {/* --- ACTION BUTTONS ADDED HERE --- */}
                    <div className="job-item-actions">
                    <button className="btn btn-secondary btn-sm" onClick={(e) => handleEdit(e, job.id)}>
                      Edit
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={(e) => handleArchive(e, job.id)}>
                      Archive
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={(e) => handleDelete(e, job.id)}>
                      Delete
                    </button>
                    </div>

                </div>



              </div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="card-footer">
          <div className="pagination-controls">
            {/* Pagination buttons remain the same */}
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="btn">
              Previous
            </button>
            <span className="pagination-text">
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="btn">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobsPage