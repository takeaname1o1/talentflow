import Dexie from 'dexie';

export interface Job {
  id: string;
  title: string;
  description?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Candidate {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  resume?: string;
  appliedDate?: Date;
}

export interface Assessment {
  id: string;
  jobId: string;
  title: string;
  description?: string;
  questions?: any[];
  createdAt?: Date;
}

export interface Timeline {
  id: string;
  jobId: string;
  candidateId?: string;
  stage: string;
  notes?: string;
  timestamp: Date;
}

export interface Response {
  id: string;
  candidateId: string;
  assessmentId: string;
  answers: any[];
  submittedAt: Date;
  score?: number;
}

class TalentFlowDB extends Dexie {
  jobs!: Dexie.Table<Job, string>;
  candidates!: Dexie.Table<Candidate, string>;
  assessments!: Dexie.Table<Assessment, string>;
  timelines!: Dexie.Table<Timeline, string>;
  responses!: Dexie.Table<Response, string>;

  constructor() {
    super('TalentFlowDB');
    
    this.version(1).stores({
      jobs: 'id, title, status, createdAt',
      candidates: 'id, name, email, appliedDate',
      assessments: 'id, jobId, title',
      timelines: 'id, jobId, candidateId, stage, timestamp',
      responses: 'id, candidateId, assessmentId, submittedAt'
    });
  }
}

export const db = new TalentFlowDB();