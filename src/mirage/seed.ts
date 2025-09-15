import { faker } from '@faker-js/faker';
import { db } from './dexie';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function maybeThrowError(probability: number) {
    if (Math.random() < probability) {
        throw new Error('Simulated random failure');
    }
}

export async function seedDatabase() {
    try {
        console.log("🌱 Checking if database needs seeding...");

        const jobCount = await db.jobs.count();
        const candidateCount = await db.candidates.count();
        const assessmentCount = await db.assessments.count();

        if (jobCount > 0 || candidateCount > 0 || assessmentCount > 0) {
            console.log("⚠️ Skipping seeding: database already contains data.");
            return;
        }

        console.log("🌱 Starting database seeding...");

        // Clear existing data
        await Promise.all([
            db.jobs.clear(),
            db.candidates.clear(),
            db.assessments.clear(),
            db.timelines.clear(),
            db.responses.clear(),
        ]);

        await sleep(faker.number.int({ min: 200, max: 1200 }));
        maybeThrowError(faker.number.float({ min: 0.05, max: 0.1 }));

        // Generate Jobs
        const jobTitles = [
            'Frontend Developer', 'Backend Engineer', 'Full Stack Developer',
            'Product Manager', 'UX/UI Designer', 'Data Scientist'
        ];

        const jobs = Array.from({ length: 25 }, () => ({
            id: faker.string.uuid(),
            title: faker.helpers.arrayElement(jobTitles),
            description: faker.lorem.paragraphs(2),
            status: faker.helpers.arrayElement(['open', 'closed', 'paused']),
            createdAt: faker.date.past({ years: 1 }),
            updatedAt: new Date(),
        }));

        await sleep(faker.number.int({ min: 200, max: 1200 }));
        maybeThrowError(faker.number.float({ min: 0.05, max: 0.1 }));
        await db.jobs.bulkAdd(jobs);

        // Generate Candidates
        const candidates = Array.from({ length: 1000 }, () => {
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

        await sleep(faker.number.int({ min: 200, max: 1200 }));
        maybeThrowError(faker.number.float({ min: 0.05, max: 0.1 }));
        await db.candidates.bulkAdd(candidates);

        // Generate Assessments (at least 3 with 10+ questions)
        const assessments = jobs.slice(0, 3).map(job => ({
            id: faker.string.uuid(),
            jobId: job.id,
            title: `${job.title} Skill Test`,
            description: `Assessment for ${job.title} position`,
            questions: Array.from({ length: 12 }, () => ({
                type: faker.helpers.arrayElement(['multiple-choice', 'coding-challenge']),
                text: faker.lorem.sentence(),
            })),
            createdAt: job.createdAt,
        }));

        await sleep(faker.number.int({ min: 200, max: 1200 }));
        maybeThrowError(faker.number.float({ min: 0.05, max: 0.1 }));
        await db.assessments.bulkAdd(assessments);

        // Generate Timelines and Responses
        // src/mirage/seed.ts

        interface Timeline {
            id: string;
            jobId: string;
            candidateId: string;
            stage: string;
            notes: string;
            timestamp: Date;
        }

        interface CandidateResponse { // renamed to avoid DOM collision
            id: string;
            candidateId: string;
            assessmentId: string;
            answers: Record<string, any>[];
            submittedAt: Date;
            score: number;
        }
        const timelines: Timeline[] = [];
        const responses: CandidateResponse[] = [];

        const hiringStages = ['Applied', 'Screening', 'Assessment', 'Interview', 'Offer', 'Hired', 'Rejected'];

        candidates.forEach(candidate => {
            const appliedJobs = faker.helpers.arrayElements(jobs, { min: 1, max: 2 });

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
                                answers: assessment.questions.map((_, idx) => ({ [`q${idx + 1}`]: 'Sample answer' })),
                                submittedAt: faker.date.soon({ days: 2, refDate: currentTimestamp }),
                                score: faker.number.int({ min: 65, max: 98 }),
                            });
                        }
                    }

                    currentTimestamp = faker.date.soon({ days: 7, refDate: currentTimestamp });
                }
            });
        });

        await sleep(faker.number.int({ min: 200, max: 1200 }));
        maybeThrowError(faker.number.float({ min: 0.05, max: 0.1 }));
        await db.timelines.bulkAdd(timelines);

        await sleep(faker.number.int({ min: 200, max: 1200 }));
        maybeThrowError(faker.number.float({ min: 0.05, max: 0.1 }));
        await db.responses.bulkAdd(responses);

        console.log("✅ Database seeded successfully!");
    } catch (error) {
        console.error("❌ Failed to seed database:", error);
    }
}
