"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Job } from "@/interfaces/job.interface"
import {
  IMinisterios,
  IRegion,
  ICiudad,
  IAreaTrabajo,
  ITipoVacante,
} from "@/interfaces/filters.interface"
import Stats from "./Stats"
import JobCard from "./JobCard"
import Pagination from "./Pagination"
import Filters from "./Filters"

interface Props {
  jobs: Job[]
  ministerios: IMinisterios[]
  regiones: IRegion[]
  ciudades: ICiudad[]
  areasTrabajo: IAreaTrabajo[]
  tiposVacantes: ITipoVacante[]
}

export default function JobSearch({
  jobs,
  ministerios,
  regiones,
  ciudades,
  areasTrabajo,
  tiposVacantes,
}: Props) {
  const [filtrosActivos, setFiltrosActivos] = useState<string[]>([])
  const [acordeonesAbiertos, setAcordeonesAbiertos] = useState({
    ministerio: true,
    salario: true,
    ubicacion: true,
    area: true,
    tipo: true,
  })

  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 12

  const agregarFiltro = (filtro: string) => {
    if (!filtrosActivos.includes(filtro)) {
      setFiltrosActivos([...filtrosActivos, filtro])
    }
  }

  const quitarFiltro = (filtro: string) => {
    setFiltrosActivos(filtrosActivos.filter((f) => f !== filtro))
  }

  const toggleAcordeon = (acordeon: string) => {
    setAcordeonesAbiertos({
      ...acordeonesAbiertos,
      [acordeon]:
        !acordeonesAbiertos[acordeon as keyof typeof acordeonesAbiertos],
    })
  }

  const searchParams = useSearchParams()
  const router = useRouter()

  const [query, setQuery] = useState(searchParams.get("terms") || "")
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs)

  useEffect(() => {
    setCurrentPage(1)

    if (query.trim() === "") {
      router.replace("?")
      setFilteredJobs(jobs)
      return
    }

    const encodedQuery = encodeURIComponent(query.trim().replace(/\s+/g, "+"))
    router.replace(`?terms=${encodedQuery}`)

    const filtered = jobs.filter(
      (job) =>
        job.cargo.toLowerCase().includes(query.toLowerCase()) ||
        job.ministerio.toLowerCase().includes(query.toLowerCase())
    )

    setFilteredJobs(filtered)
  }, [query, router])

  // 🔹 Paginar correctamente en base a "filteredJobs"
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)
  const startIndex = (currentPage - 1) * jobsPerPage
  const endIndex = startIndex + jobsPerPage
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex)

  return (
    <div className="container mx-auto px-4 py-7 max-w-7xl">
      <div className="relative mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar empleos..."
            className="text-gray-900 flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            aria-label="Términos de búsqueda"
          />
        </div>
      </div>

      <Stats
        totalActivesJobs={jobs.length}
        totalMinisterios={ministerios?.length}
        totalAreas={areasTrabajo?.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Filters
          agregarFiltro={agregarFiltro}
          quitarFiltro={quitarFiltro}
          toggleAcordeon={toggleAcordeon}
          filtrosActivos={filtrosActivos}
          setFiltrosActivos={setFiltrosActivos}
          acordeonesAbiertos={acordeonesAbiertos}
          ministerios={ministerios}
          regiones={regiones}
          ciudades={ciudades}
          areasTrabajo={areasTrabajo}
          tiposVacantes={tiposVacantes}
        />

        <div className="lg:col-span-3">
          <p className="text-gray-500 mb-10">
            Cantidad de empleos obtenidos:
            <strong> {filteredJobs.length}</strong>
          </p>

          <div className="space-y-4">
            {paginatedJobs.length > 0 ? (
              paginatedJobs.map((job, index) => (
                <JobCard key={index} job={job} />
              ))
            ) : (
              <p className="text-center text-gray-500">
                No se encontraron empleos.
              </p>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
