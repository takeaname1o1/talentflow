import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

export interface Assessment {
  id: string;
  jobId: string;
  title:string;
  description?: string;
  createdAt?: string;
}

const AssessmentsPage = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTitle, setSearchTitle] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const assessmentsPerPage = 5;

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        // In a real app, this URL would point to your API endpoint
        const response = await fetch('/api/assessments');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data: Assessment[] = await response.json();
        setAssessments(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch assessments');
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  useEffect(() => {
    const filtered = assessments
      .filter(a => a.title.toLowerCase().includes(searchTitle.toLowerCase()))
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });

    setFilteredAssessments(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTitle, sortOrder, assessments]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAssessments.length / assessmentsPerPage);
  const paginatedAssessments = filteredAssessments.slice(
    (currentPage - 1) * assessmentsPerPage,
    currentPage * assessmentsPerPage
  );

  // --- Action Handlers ---
  const handleEdit = (id: string) => {
    // Placeholder for edit logic (e.g., navigate to an edit page)
    alert(`Editing assessment with ID: ${id}`);
  };

  const handleArchive = (id: string) => {
    // Placeholder for archive logic (e.g., API call to update status)
    if (window.confirm(`Are you sure you want to archive assessment ${id}?`)) {
      alert(`Archiving assessment with ID: ${id}`);
    }
  };

  const handleDelete = (id: string) => {
    // Placeholder for delete logic
    if (window.confirm(`Are you sure you want to PERMANENTLY DELETE assessment ${id}?`)) {
      alert(`Deleting assessment with ID: ${id}`);
      // Example of how you might update state after a successful API call:
      // setAssessments(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleClearFilters = () => {
    setSearchTitle('');
    setSortOrder('newest');
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Assessments</h2>
        <Link to="/assessment/new" className="btn btn-primary">
         NEW
        </Link>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: 'var(--spacing-md)', 
        marginBottom: 'var(--spacing-lg)',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTitle}
          onChange={e => setSearchTitle(e.target.value)}
          className="form-input"
          style={{ minWidth: '200px', flex: '1' }}
        />
        <select 
          value={sortOrder} 
          onChange={e => setSortOrder(e.target.value as 'newest' | 'oldest')}
          className="form-select"
          style={{ minWidth: '150px' }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        <select 
          value={viewMode} 
          onChange={e => setViewMode(e.target.value as 'list' | 'grid')}
          className="form-select"
          style={{ minWidth: '120px' }}
        >
          <option value="list">List View</option>
          <option value="grid">Grid View</option>
        </select>
        <button 
          onClick={handleClearFilters}
          className="btn btn-outline"
        >
          Clear Filters
        </button>
      </div>

      {/* Render States */}
      {loading && <p>Loading assessments...</p>}
      {error && <p style={{ color: 'var(--error-color)' }}>Error: {error}</p>}
      {!loading && !error && filteredAssessments.length === 0 && (
        <p style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          No assessments match your filters.
        </p>
      )}

      {/* Assessments List/Grid */}
      {!loading && !error && filteredAssessments.length > 0 && (
        <>
          <div style={viewMode === 'grid' ? { 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: 'var(--spacing-md)' 
          } : undefined}>
            {paginatedAssessments.map((assessment, index) => (
              <div key={assessment.id} className="card" style={viewMode === 'grid' ? { marginBottom: 0 } : {}}>
                <div className="card-header" style={{ padding: 'var(--spacing-md)' }}>
                  <strong style={{ fontSize: '1.1rem' }}>
                    {(currentPage - 1) * assessmentsPerPage + index + 1}. {assessment.title}
                  </strong>
                  <small style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    ID: {assessment.id}
                  </small>
                </div>
                <div style={{ padding: 'var(--spacing-md)' }}>
                  <p style={{ marginBottom: 'var(--spacing-md)' }}>
                    {assessment.description || 'No description provided.'}
                  </p>
                  <small style={{ color: 'var(--text-secondary)' }}>
                    {assessment.createdAt && `Created: ${new Date(assessment.createdAt).toLocaleDateString()}`}
                  </small>
                </div>
                {/* --- ACTION BUTTONS ADDED HERE --- */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  gap: 'var(--spacing-sm)',
                  padding: '0 var(--spacing-md) var(--spacing-md)',
                  borderTop: '1px solid var(--border-color)', 
                  paddingTop: 'var(--spacing-md)'
                }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(assessment.id)}>
                    Edit
                  </button>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => handleArchive(assessment.id)}>
                    Archive
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(assessment.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: 'var(--spacing-md)',
            marginTop: 'var(--spacing-xl)',
            padding: 'var(--spacing-md)'
          }}>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1}
              className="btn btn-outline"
            >
              Previous
            </button>
            <span style={{ color: 'var(--text-secondary)' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages}
              className="btn btn-outline"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AssessmentsPage;