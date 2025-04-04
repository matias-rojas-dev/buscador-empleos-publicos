import type { Job } from "@/interfaces/job.interface"

export async function analyzeJobMatch(
  userText: string,
  jobs: Job[]
): Promise<Job[]> {
  try {
    // 1. Hacemos POST a api/openai
    const res = await fetch("api/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userText, jobs }),
    })

    if (!res.ok) {
      console.error("[analyzeJobMatch] Error en api/openai:", res.statusText)
      return []
    }

    const data = await res.json()
    const matchedIds: string[] = data.matchedIds || []

    const recommendedJobs = jobs.filter((job) => matchedIds.includes(job.cargo))

    return recommendedJobs
  } catch (error) {
    console.error("[analyzeJobMatch] Error al llamar a api/openai:", error)
    return []
  }
}
