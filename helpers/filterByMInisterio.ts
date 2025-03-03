import { Job } from "@/interfaces/job.interface"
import { IMinisterios } from "@/interfaces/ministerio.interface"

export const filterByMinisterio = (jobs: Job[]): IMinisterios[] => {
  const ministerios = Array.from(new Set(jobs.map((job) => job.ministerio)))

  return ministerios.map((ministerio, index) => ({
    id: index + 1,
    name: ministerio,
  }))
}
