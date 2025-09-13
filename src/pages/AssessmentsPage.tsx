import { useParams } from 'react-router-dom';

const AssessmentsPage = () => {
  const { jobId } = useParams();

  return (
    <div>
      <h1>Assessments Page</h1>
      <p>Assessments for Job ID: {jobId}</p>
    </div>
  );
};

export default AssessmentsPage;