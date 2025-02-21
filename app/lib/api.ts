import { ApiJobs } from "@/helpers/transformJob"

export async function getJobs(): Promise<ApiJobs[]> {
  try {
    const res = await fetch(
      "https://www.empleospublicos.cl/data/convocatorias2_nueva.txt?_=1740075880266",
      {
        cache: "no-store",
      }
    )

    if (!res.ok) {
      throw new Error(`Error al obtener datos: ${res.statusText}`)
    }

    const jobs: ApiJobs[] = await res.json()
    return jobs
  } catch (error) {
    console.error("❌ Error en getJobs:", error)
    return []
  }
}
