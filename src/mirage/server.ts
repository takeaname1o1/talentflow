import { createServer, Model, Response } from "miragejs";
import { db } from "./dexie";

// Define types for better TypeScript support
interface Job {
    id: string;
    title: string;
    description?: string;
    status?: string;
}

interface Candidate {
    id: string;
    name: string;
    email?: string;
    phone?: string;
}

interface Assessment {
    id: string;
    jobId: string;
    title: string;
    questions?: any[];
}

interface Timeline {
    id: string;
    jobId: string;
    stage: string;
    timestamp: Date;
}

interface ResponseData {
    id: string;
    candidateId: string;
    assessmentId: string;
    answers: any[];
}

export function makeServer({ environment = "development" } = {}) {
    return createServer({
        environment,

        models: {
            job: Model.extend<Partial<Job>>({}),
            candidate: Model.extend<Partial<Candidate>>({}),
            assessment: Model.extend<Partial<Assessment>>({}),
            timeline: Model.extend<Partial<Timeline>>({}),
            response: Model.extend<Partial<ResponseData>>({}),
        },

        seeds(server) {
            // Seed initial data
            server.create("job", {
                id: "1",
                title: "Frontend Developer",
                description: "Develop user interfaces using React and TypeScript",
                status: "open",
            });
            server.create("job", {
                id: "2",
                title: "Backend Developer",
                description: "Build scalable APIs and services",
                status: "open",
            });

            server.create("candidate", {
                id: "1",
                name: "Alice Johnson",
                email: "alice@example.com",
                phone: "555-1234",
            });
            server.create("candidate", {
                id: "2",
                name: "Bob Smith",
                email: "bob@example.com",
                phone: "555-5678",
            });
        },

        routes() {
            this.namespace = "api";

            // Simulate network latency (200-1200ms)
            this.timing = Math.floor(200 + Math.random() * 1000);

            // Jobs endpoints
            this.get("/jobs", async () => {
                try {
                    const jobs = await db.jobs.toArray();
                    return jobs;
                } catch (error) {
                    return new Response(500, {}, { error: "Failed to fetch jobs" });
                }
            });

            this.post("/jobs", async (schema, request) => {
                try {
                    const attrs = JSON.parse(request.requestBody);

                    // Simulate random server errors (7% chance)
                    if (Math.random() < 0.07) {
                        return new Response(
                            500,
                            {},
                            { error: "Random server error occurred" }
                        );
                    }

                    await db.jobs.add(attrs);
                    return attrs;
                } catch (error) {
                    return new Response(500, {}, { error: "Failed to create job" });
                }
            });

            this.patch("/jobs/:id", async (schema, request) => {
                try {
                    const id = request.params.id;
                    const attrs = JSON.parse(request.requestBody);

                    // Simulate random server errors
                    if (Math.random() < 0.07) {
                        return new Response(
                            500,
                            {},
                            { error: "Random server error occurred" }
                        );
                    }

                    await db.jobs.update(id, attrs);
                    const updatedJob = await db.jobs.get(id);
                    return (
                        updatedJob || new Response(404, {}, { error: "Job not found" })
                    );
                } catch (error) {
                    return new Response(500, {}, { error: "Failed to update job" });
                }
            });

            this.delete("/jobs/:id", async (schema, request) => {
                try {
                    const id = request.params.id;
                    await db.jobs.delete(id);
                    return new Response(204);
                } catch (error) {
                    return new Response(500, {}, { error: "Failed to delete job" });
                }
            });

            // Candidates endpoints
            this.get("/candidates", async () => {
                try {
                    const candidates = await db.candidates.toArray();
                    return candidates;
                } catch (error) {
                    return new Response(500, {}, { error: "Failed to fetch candidates" });
                }
            });

            this.post("/candidates", async (schema, request) => {
                try {
                    const attrs = JSON.parse(request.requestBody);

                    if (Math.random() < 0.07) {
                        return new Response(
                            500,
                            {},
                            { error: "Random server error occurred" }
                        );
                    }

                    await db.candidates.add(attrs);
                    return attrs;
                } catch (error) {
                    return new Response(500, {}, { error: "Failed to create candidate" });
                }
            });

            // Add similar endpoints for assessments, timelines, and responses
        },
    });
}
