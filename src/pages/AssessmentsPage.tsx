import { useEffect, useState } from 'react';
import styles from './JobsPage.module.css'

export interface Assessment {
  id: string;
  jobId: string;
  title: string;
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
  const [viewMode, setViewMode] = useState<'list' | 'box'>('list');
  const assessmentsPerPage = 5;

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
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
    setCurrentPage(1);
  }, [searchTitle, sortOrder, assessments]);

  const totalPages = Math.ceil(filteredAssessments.length / assessmentsPerPage);
  const paginatedAssessments = filteredAssessments.slice(
    (currentPage - 1) * assessmentsPerPage,
    currentPage * assessmentsPerPage
  );

  const handleClearFilters = () => {
    setSearchTitle('');
    setSortOrder('newest');
  };

  return (
    <div className={styles.container}>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTitle}
          onChange={e => setSearchTitle(e.target.value)}
        />
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value as 'newest' | 'oldest')}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        <select value={viewMode} onChange={e => setViewMode(e.target.value as 'list' | 'box')}>
          <option value="list">List View</option>
          <option value="box">Box View</option>
        </select>
        <button onClick={handleClearFilters}>Clear Filters</button>
      </div>

      {/* Render States */}
      {loading && <p>Loading assessments...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && filteredAssessments.length === 0 && <p>No assessments match your filters.</p>}

      {!loading && !error && filteredAssessments.length > 0 && (
        <>
          <div className={viewMode === 'box' ? styles.cardGrid : undefined}>
            {paginatedAssessments.map((assessment, index) => (
              <div key={assessment.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <strong>
                    {(currentPage - 1) * assessmentsPerPage + index + 1}. {assessment.title}
                  </strong>
                  <small style={{ color: '#666' }}>ID: {assessment.id}</small>
                </div>
                <p>{assessment.description}</p>
                <small>
                  {assessment.createdAt && `Created: ${new Date(assessment.createdAt).toLocaleDateString()}`}
                </small>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AssessmentsPage;
