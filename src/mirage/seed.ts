import { faker } from '@faker-js/faker';
import { db } from './dexie';

export async function seedDatabase() {
    try {
        console.log("🌱 Starting database seeding...");

        // Clear existing data
        await Promise.all([
            db.jobs.clear(),
            db.candidates.clear(),
            db.assessments.clear(),
            db.timelines.clear(),
            db.responses.clear(),
        ]);

        // Generate Jobs
        const jobs = Array.from({ length: 600 }, () => {
            const title = faker.helpers.arrayElement([
                'Frontend Developer', 'Backend Engineer', 'Full Stack Developer',
                'Product Manager', 'UX/UI Designer', 'Data Scientist'
            ]);

            return {
                id: faker.string.uuid(),
                title,
                description: faker.lorem.paragraphs(2),
                status: faker.helpers.arrayElement(['open', 'closed', 'paused']),
                createdAt: faker.date.past({ years: 1 }),
                updatedAt: new Date(),
            };
        });
        await db.jobs.bulkAdd(jobs);

        // Generate Candidates
        const candidates = Array.from({ length: 50 }, () => {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();

            return {
                id: faker.string.uuid(),
                name: `${firstName} ${lastName}`,
                email: faker.internet.email({ firstName, lastName }),
                phone: faker.phone.number(),
                resume: faker.internet.url() + '/resume.pdf',
                appliedDate: faker.date.recent({ days: 60 }),
            };
        });
        await db.candidates.bulkAdd(candidates);

        // Generate Assessments
        const assessments = jobs.flatMap(job => {
            if (job.status !== 'open') return [];

            return Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => ({
                id: faker.string.uuid(),
                jobId: job.id,
                title: `${job.title} Skill Test`,
                description: `Assessment for ${job.title} position`,
                questions: [
                    { type: 'multiple-choice', text: faker.lorem.sentence() },
                    { type: 'coding-challenge', text: 'Implement a function to reverse a string.' }
                ],
                createdAt: job.createdAt,
            }));
        });
        await db.assessments.bulkAdd(assessments);
        interface Timeline {
            id: string;
            jobId: string;
            candidateId: string;
            stage: string;
            notes: string;
            timestamp: Date;
        }

        interface Response {
            id: string;
            candidateId: string;
            assessmentId: string;
            answers: Record<string, any>[];
            submittedAt: Date;
            score: number;
        }

        // Generate Timelines and Responses
        const timelines: Timeline[] = [];
        const responses: Response[] = [];
        const hiringStages = ['Applied', 'Screening', 'Assessment', 'Interview', 'Offer', 'Hired', 'Rejected'];

        candidates.forEach(candidate => {
            const appliedJobs = faker.helpers.arrayElements(
                jobs.filter(j => j.status === 'open'),
                { min: 1, max: 2 }
            );

            appliedJobs.forEach(job => {
                let currentTimestamp = candidate.appliedDate!;
                const maxStageIndex = faker.number.int({ min: 0, max: hiringStages.length - 1 });

                for (let i = 0; i <= maxStageIndex; i++) {
                    const stage = hiringStages[i];

                    timelines.push({
                        id: faker.string.uuid(),
                        jobId: job.id,
                        candidateId: candidate.id,
                        stage,
                        notes: `${candidate.name} passed ${stage} stage`,
                        timestamp: currentTimestamp,
                    });

                    if (stage === 'Assessment') {
                        const assessment = assessments.find(a => a.jobId === job.id);
                        if (assessment) {
                            responses.push({
                                id: faker.string.uuid(),
                                candidateId: candidate.id,
                                assessmentId: assessment.id,
                                answers: [{ q1: 'A', q2: 'function reverse(s){...}' }],
                                submittedAt: faker.date.soon({ days: 2, refDate: currentTimestamp }),
                                score: faker.number.int({ min: 65, max: 98 }),
                            });
                        }
                    }

                    currentTimestamp = faker.date.soon({ days: 7, refDate: currentTimestamp });
                }
            });
        });

        await db.timelines.bulkAdd(timelines);
        await db.responses.bulkAdd(responses);

        console.log("✅ Database seeded successfully!");
    } catch (error) {
        console.error("❌ Failed to seed database:", error);
    }
}