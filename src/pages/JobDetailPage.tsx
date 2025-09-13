import { useParams } from 'react-router-dom';

const JobDetailPage = () => {
  const { jobId } = useParams();

  return (
    <div>
      <h1>Job Detail Page</h1>
      <p>Job ID: {jobId}</p>
    </div>
  );
};

export default JobDetailPage;