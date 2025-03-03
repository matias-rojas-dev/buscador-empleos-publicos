import { transformJob } from "@/helpers/transformJob"
import JobSearch from "./components/JobSearch"
import { getJobs } from "./lib/api"
import type { Job } from "@/interfaces/job.interface"
import Footer from "./components/Footer"
import { filterByMinisterio } from "@/helpers/filterByMInisterio"

export const dynamic = "force-dynamic"

export default async function Home() {
  const initialJobs = await getJobs()
  const transformedJobs: Job[] = transformJob(initialJobs)
  const ministerios = filterByMinisterio(transformedJobs)

  return (
    <main className="flex lg:justify-center flex-col lg:w-full">
      <div className="m-2 lg:m-10 lg:mx-44">
        <h1 className="text-5xl font-extrabold text-center text-black mb-4 tracking-tight">
          Buscador de Empleos Públicos
        </h1>
        <div className="w-64 h-1 mx-auto mb-12 flex">
          <div className="w-1/2 h-full bg-blue-500"></div>
          <div className="w-1/2 h-full bg-red-500"></div>
        </div>

        {transformedJobs.length > 0 ? (
          <JobSearch initialJobs={transformedJobs} ministerios={ministerios} />
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No hay empleos disponibles en este momento. Intente más tarde.
          </p>
        )}
      </div>
      <Footer />
    </main>
  )
}
