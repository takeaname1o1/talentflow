import { useParams } from 'react-router-dom';

const CandidateDetailPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Candidate Detail Page</h1>
      <p>Candidate ID: {id}</p>
    </div>
  );
};

export default CandidateDetailPage;