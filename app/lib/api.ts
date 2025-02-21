import { ApiJobs } from "@/helpers/transformJob"

export async function getJobs(): Promise<ApiJobs[]> {
  try {
    console.log("🔍 Fetching jobs...")

    const res = await fetch(
      "https://www.empleospublicos.cl/data/convocatorias2_nueva.txt?_=1740075880266",
      { cache: "no-store" }
    )

    if (!res.ok) {
      throw new Error(`❌ Error HTTP ${res.status}: ${res.statusText}`)
    }

    const jobs: ApiJobs[] = await res.json()

    if (!Array.isArray(jobs)) {
      throw new Error("❌ La API no devolvió un array válido de empleos.")
    }

    console.log(`✅ ${jobs.length} empleos obtenidos.`)
    return jobs
  } catch (error) {
    console.error("❌ Error en getJobs:", error)
    return []
  }
}
