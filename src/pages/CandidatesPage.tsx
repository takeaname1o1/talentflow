import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './JobsPage.module.css'

export interface Candidate {
  id: string
  name: string
  email?: string
  phone?: string
  resume?: string
  appliedDate?: Date
}

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch('/api/candidates')
        if (!res.ok) throw new Error(`Error: ${res.statusText}`)
        const data: Candidate[] = await res.json()
        setCandidates(data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch candidates')
      } finally {
        setLoading(false)
      }
    }

    fetchCandidates()
  }, [])

  // Apply filters & sorting
  useEffect(() => {
    let filtered = candidates.filter(c => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

      const applied = c.appliedDate ? new Date(c.appliedDate) : null
      const matchesStart = startDate ? applied && applied >= new Date(startDate) : true
      const matchesEnd = endDate ? applied && applied <= new Date(endDate) : true

      return matchesSearch && matchesStart && matchesEnd
    })

    filtered.sort((a, b) => {
      const dateA = a.appliedDate ? new Date(a.appliedDate).getTime() : 0
      const dateB = b.appliedDate ? new Date(b.appliedDate).getTime() : 0
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

    setFilteredCandidates(filtered)
  }, [searchTerm, sortOrder, startDate, endDate, candidates])

  const handleClearFilters = () => {
    setSearchTerm('')
    setSortOrder('newest')
    setStartDate('')
    setEndDate('')
  }

  if (loading) return <p>Loading candidates...</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

  return (
    <div className={styles.container}>
      <h1>Candidates Page</h1>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value as 'newest' | 'oldest')}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        <button onClick={handleClearFilters}>Clear Filters</button>
      </div>

      {/* Candidate List */}
      {filteredCandidates.length === 0 ? (
        <p>No candidates match your filters.</p>
      ) : (
        <ul className={styles.list}>
          {filteredCandidates.map(candidate => (
            <li
              key={candidate.id}
              className={styles.card}
              onClick={() => navigate(`/candidates/${candidate.id}`)}
              style={{
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f5')}
              onMouseLeave={e => (e.currentTarget.style.background = 'white')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{candidate.name}</strong>
                <small style={{ color: '#666' }}>ID: {candidate.id}</small>
              </div>
              <div style={{ marginTop: 4 }}>
                {candidate.email && <div>Email: {candidate.email}</div>}
                {candidate.phone && <div>Phone: {candidate.phone}</div>}
                {candidate.appliedDate && (
                  <div>
                    Applied: {new Date(candidate.appliedDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CandidatesPage
