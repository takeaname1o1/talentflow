import { useEffect, useState, useMemo, type FC, type ReactNode } from 'react';
import { ResponsivePie, type PieSvgProps } from '@nivo/pie';
import { ResponsiveBar, type BarSvgProps, type BarDatum } from '@nivo/bar';
import styles from './Dashboard.module.css';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Job {
  id: string;
  title: string;
  description?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Candidate {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  resume?: string;
  appliedDate?: Date;
}

interface Assessment {
  id: string;
  jobId: string;
  title: string;
  description?: string;
  questions?: any[];
  createdAt?: Date;
}

interface SummaryItem {
  id: string;
  label: string;
  value: number;
}

interface DashboardData {
  jobs: Job[];
  assessments: Assessment[];
  candidates: Candidate[];
}

// ============================================================================
// DATA FETCHING HOOK
// ============================================================================

/**
 * Custom hook to fetch all necessary data for the dashboard.
 * @returns An object containing the dashboard data, loading state, and error state.
 */
const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>({
    jobs: [],
    assessments: [],
    candidates: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const responses = await Promise.all([
          fetch('/api/jobs'),
          fetch('/api/candidates'),
          fetch('/api/assessments'),
        ]);

        for (const res of responses) {
          if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
          }
        }

        const [jobs, candidates, assessments] = await Promise.all(
          responses.map(res => res.json())
        );

        setData({ jobs, candidates, assessments });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return { data, loading, error };
};

// ============================================================================
// UI & CHART COMPONENTS
// ============================================================================

interface DashboardCardProps {
  title: string;
  children: ReactNode;
}

const DashboardCard: FC<DashboardCardProps> = ({ title, children }) => (
  <div className={styles.chartBox}>
    <h3 className={styles.chartTitle}>{title}</h3>
    <div className={styles.chartContent}>{children}</div>
  </div>
);

const SummaryPieChart = (
  props: Omit<PieSvgProps<SummaryItem>, 'width' | 'height'>
) => (
  <ResponsivePie
    {...props}
    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
    innerRadius={0.5}
    padAngle={0.7}
    cornerRadius={3}
    activeOuterRadiusOffset={8}
    colors={{ scheme: 'set2' }}
    borderWidth={1}
    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
    arcLinkLabelsSkipAngle={10}
    arcLinkLabelsTextColor="#333333"
    arcLinkLabelsThickness={2}
    arcLinkLabelsColor={{ from: 'color' }}
    arcLabelsSkipAngle={10}
    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
  />
);

// Define a BarDatum with index signature
interface JobsVsCandidatesDatum extends BarDatum {
  category: string;
  count: number;
  [key: string]: string | number; // Index signature
}

const JobsVsCandidatesBarChart = (
  props: Omit<BarSvgProps<JobsVsCandidatesDatum>, 'width' | 'height'>
) => (
  <ResponsiveBar
    {...props}
    keys={['count']}
    indexBy="category"
    margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
    padding={0.4}
    valueScale={{ type: 'linear' }}
    indexScale={{ type: 'band', round: true }}
    colors={{ scheme: 'nivo' }}
    borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      legend: 'Category',
      legendPosition: 'middle',
      legendOffset: 32,
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      legend: 'Count',
      legendPosition: 'middle',
      legendOffset: -40,
    }}
    labelSkipWidth={12}
    labelSkipHeight={12}
    labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }} // Fixed the typo here
    role="application"
  />
);

const LoadingIndicator = () => (
  <div className={styles.statusContainer}>Loading dashboard...</div>
);

interface ErrorMessageProps {
  error: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ error }) => (
  <div className={`${styles.statusContainer} ${styles.error}`}>
    Error: {error}
  </div>
);

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

export default function Dashboard() {
  const { data, loading, error } = useDashboardData();
  const { jobs, assessments, candidates } = data;

  const summaryData = useMemo<SummaryItem[]>(
    () => [
      { id: 'Jobs', label: 'Jobs', value: jobs.length },
      { id: 'Assessments', label: 'Assessments', value: assessments.length },
      { id: 'Candidates', label: 'Candidates', value: candidates.length },
    ],
    [jobs.length, assessments.length, candidates.length]
  );

  const jobsVsCandidatesData = useMemo<JobsVsCandidatesDatum[]>(
    () => [
      { category: 'Jobs', count: jobs.length },
      { category: 'Candidates', count: candidates.length },
    ],
    [jobs.length, candidates.length]
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className={styles.dashboard}>
      <header>
        <h2 className={styles.title}>Dashboard Overview</h2>
      </header>

      <main className={styles.chartsContainer}>
        <DashboardCard title="Totals Breakdown">
          <SummaryPieChart data={summaryData} />
        </DashboardCard>

        <DashboardCard title="Jobs vs Candidates">
          <JobsVsCandidatesBarChart data={jobsVsCandidatesData} />
        </DashboardCard>
      </main>
    </div>
  );
}