import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface Candidate {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  resume?: string;
  appliedDate?: Date;
}

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch("/api/candidates");
        if (!res.ok) throw new Error(`Error: ${res.statusText}`);
        const data: Candidate[] = await res.json();
        setCandidates(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch candidates");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  useEffect(() => {
    let filtered = candidates.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      const applied = c.appliedDate ? new Date(c.appliedDate) : null;
      const matchesStart = startDate
        ? applied && applied >= new Date(startDate)
        : true;
      const matchesEnd = endDate
        ? applied && applied <= new Date(endDate)
        : true;

      return matchesSearch && matchesStart && matchesEnd;
    });

    filtered.sort((a, b) => {
      const dateA = a.appliedDate ? new Date(a.appliedDate).getTime() : 0;
      const dateB = b.appliedDate ? new Date(b.appliedDate).getTime() : 0;
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredCandidates(filtered);
  }, [searchTerm, sortOrder, startDate, endDate, candidates]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSortOrder("newest");
    setStartDate("");
    setEndDate("");
  };

  if (loading) return <p className="loading">Loading candidates...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Candidates</h2>
      </div>

      <section
        className="filters"
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
          style={{ flex: "1", minWidth: "200px" }}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="form-input"
          style={{ minWidth: "140px" }}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="form-input"
          style={{ minWidth: "140px" }}
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
          className="form-select"
          style={{ minWidth: "150px" }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        <button onClick={handleClearFilters} className="btn btn-outline">
          Clear Filters
        </button>
      </section>

      {filteredCandidates.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "var(--text-secondary)",
          }}
        >
          No candidates match your filters.
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {filteredCandidates.map((candidate) => (
            <li
              key={candidate.id}
              className="card"
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                border: "1px solid var(--border-color)",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "0.75rem",
                }}
              >
                <strong
                  style={{ fontSize: "1.2rem", color: "var(--text-color)" }}
                >
                  {candidate.name}
                </strong>
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    backgroundColor: "var(--bg-color)",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                  }}
                >
                  ID: {candidate.id}
                </span>
              </div>

              <div
                style={{
                  color: "var(--text-secondary)",
                  marginBottom: "0.75rem",
                }}
              >
                {candidate.email && <div>Email: {candidate.email}</div>}
                {candidate.phone && <div>Phone: {candidate.phone}</div>}
                {candidate.appliedDate && (
                  <div>
                    Applied:{" "}
                    {new Date(candidate.appliedDate).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                }}
              >
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(e, candidate.id);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArchive(e, candidate.id);
                  }}
                >
                  Archive
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(e, candidate.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CandidatesPage;
