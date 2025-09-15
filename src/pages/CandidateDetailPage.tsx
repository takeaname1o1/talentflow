import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from './JobsPage.module.css' // or create CandidateDetailPage.module.css

export interface Candidate {
  id: string
  name: string
  email?: string
  phone?: string
  resume?: string
  appliedDate?: Date
}

const CandidateDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await fetch(`/api/candidates/${id}`)
        if (!res.ok) throw new Error(`Error: ${res.statusText}`)
        const data: Candidate = await res.json()
        setCandidate(data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch candidate')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchCandidate()
  }, [id])

  if (loading) return <p>Loading candidate details...</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>
  if (!candidate) return <p>Candidate not found.</p>

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
        ← Back
      </button>

      <h1>{candidate.name}</h1>
      <div className={styles.card} style={{ maxWidth: 500 }}>
        <p><strong>ID:</strong> {candidate.id}</p>
        {candidate.email && <p><strong>Email:</strong> {candidate.email}</p>}
        {candidate.phone && <p><strong>Phone:</strong> {candidate.phone}</p>}
        {candidate.resume && (
          <p>
            <strong>Resume:</strong>{' '}
            <a href={candidate.resume} target="_blank" rel="noopener noreferrer">
              View Resume
            </a>
          </p>
        )}
        {candidate.appliedDate && (
          <p>
            <strong>Applied:</strong>{' '}
            {new Date(candidate.appliedDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  )
}

export default CandidateDetailPage
