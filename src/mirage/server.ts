import { createServer, Response } from "miragejs";
import { db } from "./dexie";
import { seedDatabase } from "./seed";

export function makeServer() {
    // Seed database on server start
    seedDatabase();

    return createServer({
        routes() {
            this.namespace = "api";
            this.timing = Math.floor(200 + Math.random() * 1000);

            // Jobs endpoints
            this.get("/jobs", async () => {
                try {
                    return await db.jobs.toArray();
                } catch (error) {
                    return new Response(500, {}, { error: "Failed to fetch jobs" });
                }
            });

            this.get("/jobs/:id", async (_schema, request) => {
                try {
                    const id = request.params.id;
                    const job = await db.jobs.get(id);

                    if (!job) {
                        return new Response(404, {}, { error: "Job not found" });
                    }

                    return job;
                } catch (error) {
                    return new Response(500, {}, { error: "Failed to fetch job" });
                }
            });


            this.post("/jobs", async (_schema, request) => {
                try {
                    const attrs = JSON.parse(request.requestBody);
                    if (Math.random() < 0.07) {
                        return new Response(500, {}, { error: "Random server error" });
                    }
                    await db.jobs.add(attrs);
                    return attrs;
                } catch (error) {
                    return new Response(500, {}, { error: "Failed to create job" });
                }
            });

            this.patch("/jobs/:id", async (_schema, request) => {
                try {
                    const id = request.params.id;
                    const attrs = JSON.parse(request.requestBody);

                    if (Math.random() < 0.07) {
                        return new Response(500, {}, { error: "Random server error" });
                    }

                    await db.jobs.update(id, attrs);
                    const updatedJob = await db.jobs.get(id);

                    return updatedJob || new Response(404, {}, { error: "Job not found" });
                } catch (error) {
                    return new Response(500, {}, { error: "Failed to update job" });
                }
            });

            this.delete("/jobs/:id", async (_schema, request) => {
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
                    return await db.candidates.toArray();
                } catch (error) {
                    return new Response(500, {}, { error: "Failed to fetch candidates" });
                }
            });

            // ✅ NEW: Get candidate by ID
            this.get("/candidates/:id", async (_schema, request) => {
                try {
                    const id = request.params.id;
                    const candidate = await db.candidates.get(id);

                    if (!candidate) {
                        return new Response(404, {}, { error: "Candidate not found" });
                    }

                    return candidate;
                } catch (error) {
                    return new Response(500, {}, { error: "Failed to fetch candidate" });
                }
            });

            this.post("/candidates", async (_schema, request) => {
                try {
                    const attrs = JSON.parse(request.requestBody);
                    if (Math.random() < 0.07) {
                        return new Response(500, {}, { error: "Random server error" });
                    }
                    await db.candidates.add(attrs);
                    return attrs;
                } catch (error) {
                    return new Response(500, {}, { error: "Failed to create candidate" });
                }
            });

            // Add similar endpoints for other entities (assessments, timelines, responses)
        },
    });
}
