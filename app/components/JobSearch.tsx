"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, useRef, useCallback } from "react"
import type { Job } from "@/interfaces/job.interface"
import type {
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
import ExcelDownloader from "./ExcelDownloader"
import AIJobMatcher from "./AIJobMatcher"

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
  const searchParams = useSearchParams()
  const router = useRouter()

  const [filtrosActivos, setFiltrosActivos] = useState<string[]>([])
  const [aiRecommendedJobs, setAiRecommendedJobs] = useState<Job[] | null>(null)
  const handleAIRecommendations = (recommendedJobs: Job[]) => {
    setAiRecommendedJobs(recommendedJobs)
  }

  const [acordeonesAbiertos, setAcordeonesAbiertos] = useState({
    ministerio: true,
    salario: true,
    ubicacion: true,
    area: true,
    tipo: true,
  })

  function getMinMaxSalary(job: Job[]) {
    // Función auxiliar para convertir "35000,00" a número (35000.00)
    const parseSalary = (salaryString: string) => {
      if (!salaryString) return 0
      // Quitar puntos (si existieran) y cambiar la coma decimal por punto
      const cleanString = salaryString.replace(/\./g, "").replace(",", ".")
      return parseFloat(cleanString) || 0
    }

    // Convertimos cada "Renta Bruta" a número
    const salaries = job.map((item) => parseSalary(item.rentaBruta))

    // Si el arreglo viene vacío o no hay salarios válidos, devolvemos min=0 y max=0
    if (salaries.length === 0) {
      return { min: 0, max: 0 }
    }

    // Obtenemos el mínimo y el máximo del array
    const min = Math.min(...salaries)
    const max = Math.max(...salaries)

    return { min, max }
  }

  // Llamamos la función
  const { min, max } = getMinMaxSalary(jobs)

  console.log(min) // 35000
  console.log(max) // 50000.5

  const [rangoSalarioActual, setRangoSalarioActual] = useState<string | null>(
    null
  )

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 12

  const [isLoading, setIsLoading] = useState(false)
  const [showAIPanel, setShowAIPanel] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const filtros = params.get("filtros")?.split(",") || []
    setFiltrosActivos(filtros)

    const filtroSalario = filtros.find((f) => f.startsWith("Salario:"))
    if (filtroSalario) {
      setRangoSalarioActual(filtroSalario)
    }
  }, [searchParams])

  const actualizarFiltrosURL = useCallback(
    (filtros: string[]) => {
      setIsLoading(true)
      const params = new URLSearchParams(searchParams.toString())
      if (filtros.length > 0) {
        params.set("filtros", filtros.join(","))
      } else {
        params.delete("filtros")
      }
      router.replace(`?${params.toString()}`)
      setTimeout(() => setIsLoading(false), 500)
    },
    [searchParams, router]
  )

  const debounceSalarioFiltro = useCallback(
    (filtroSalario: string) => {
      setRangoSalarioActual(filtroSalario)

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        const nuevosFiltros = filtrosActivos.filter(
          (f) => !f.startsWith("Salario:")
        )
        nuevosFiltros.push(filtroSalario)
        setFiltrosActivos(nuevosFiltros)
        actualizarFiltrosURL(nuevosFiltros)
      }, 1000)
    },
    [filtrosActivos, actualizarFiltrosURL]
  )

  const agregarFiltro = useCallback(
    (filtro: string) => {
      if (filtro.startsWith("Salario:")) {
        debounceSalarioFiltro(filtro)
      } else {
        const nuevosFiltros = [...filtrosActivos, filtro]
        setFiltrosActivos(nuevosFiltros)
        actualizarFiltrosURL(nuevosFiltros)
      }
    },
    [filtrosActivos, debounceSalarioFiltro, actualizarFiltrosURL]
  )

  const quitarFiltro = useCallback(
    (filtro: string) => {
      const nuevosFiltros = filtrosActivos.filter((f) => f !== filtro)
      setFiltrosActivos(nuevosFiltros)
      actualizarFiltrosURL(nuevosFiltros)

      if (filtro.startsWith("Salario:")) {
        setRangoSalarioActual(null)
      }
    },
    [filtrosActivos, actualizarFiltrosURL]
  )

  // Función para alternar acordeones
  const toggleAcordeon = (acordeon: string) => {
    setAcordeonesAbiertos((prev) => ({
      ...prev,
      [acordeon]: !prev[acordeon as keyof typeof prev],
    }))
  }

  const convertirSalario = (salarioString: string): number => {
    return Number.parseFloat(salarioString.replace(/\./g, "").replace(",", "."))
  }

  const aplicarFiltros = (jobs: Job[]) => {
    if (filtrosActivos.length === 0) return jobs

    return jobs.filter((job) => {
      const filtrosMinisterio = filtrosActivos.filter((f) =>
        f.startsWith("Ministerio:")
      )
      const filtrosArea = filtrosActivos.filter((f) => f.startsWith("Área:"))
      const filtrosTipo = filtrosActivos.filter((f) => f.startsWith("Tipo:"))
      const filtrosRegion = filtrosActivos.filter((f) =>
        f.startsWith("Región:")
      )
      const filtrosCiudad = filtrosActivos.filter((f) =>
        f.startsWith("Ciudad:")
      )
      const filtroSalario = filtrosActivos.find((f) => f.startsWith("Salario:"))

      const cumpleMinisterio =
        filtrosMinisterio.length === 0 ||
        filtrosMinisterio.some(
          (f) => job.ministerio === f.replace("Ministerio: ", "")
        )

      const cumpleArea =
        filtrosArea.length === 0 ||
        filtrosArea.some((f) => job.areaTrabajo === f.replace("Área: ", ""))

      const cumpleTipo =
        filtrosTipo.length === 0 ||
        filtrosTipo.some((f) => job.tipoVacante === f.replace("Tipo: ", ""))

      const cumpleRegion =
        filtrosRegion.length === 0 ||
        filtrosRegion.some((f) => job.region === f.replace("Región: ", ""))

      const cumpleCiudad =
        filtrosCiudad.length === 0 ||
        filtrosCiudad.some((f) => job.ciudad === f.replace("Ciudad: ", ""))

      let cumpleSalario = true
      if (filtroSalario) {
        const range = filtroSalario.replace("Salario: ", "").split("-")
        const min = Number.parseInt(range[0], 10)
        const max = Number.parseInt(range[1], 10)
        const salarioJob = convertirSalario(job.rentaBruta)
        cumpleSalario = salarioJob >= min && salarioJob <= max
      }

      return (
        cumpleMinisterio &&
        cumpleArea &&
        cumpleTipo &&
        cumpleRegion &&
        cumpleCiudad &&
        cumpleSalario
      )
    })
  }

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const filteredJobs = aplicarFiltros(jobs)

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)
  const startIndex = (currentPage - 1) * jobsPerPage
  const endIndex = startIndex + jobsPerPage
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [filtrosActivos])

  return (
    <div className="container mx-auto px-4 py-7 max-w-7xl">
      <div className="relative mb-8">
        <div className="flex gap-2">
          <input
            type="text"
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

      <div className="mb-6">
        <button
          onClick={() => setShowAIPanel(!showAIPanel)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a8 8 0 0 0-8 8c0 1.5.5 2.5 1.5 3.5L12 20l6.5-6.5c1-1 1.5-2 1.5-3.5a8 8 0 0 0-8-8z"></path>
            <circle cx="12" cy="10" r="1"></circle>
          </svg>
          {showAIPanel
            ? "Ocultar buscador inteligente"
            : "Buscar empleos con IA"}
        </button>
      </div>

      {/* Panel de IA */}
      {showAIPanel && (
        <div className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-100">
          <AIJobMatcher
            jobs={jobs}
            onRecommendations={handleAIRecommendations}
          />
        </div>
      )}

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
          rangoSalarioActual={rangoSalarioActual}
          minSalary={min}
          maxSalary={max}
        />

        <div className="lg:col-span-3">
          <div className="flex items-center mb-10 justify-between">
            <div className="flex justify-center">
              <p className="text-gray-500">
                Cantidad de empleos obtenidos:
                <strong> {filteredJobs.length}</strong>
              </p>

              {isLoading && (
                <div className="ml-3 inline-flex items-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-blue-500 border-r-transparent"></div>
                  <span className="ml-2 text-sm text-gray-500">
                    Actualizando...
                  </span>
                </div>
              )}
            </div>
            <ExcelDownloader jobs={filteredJobs} />
          </div>

          {aiRecommendedJobs && (
            <div className="mb-6 bg-purple-100 p-4 rounded-md border border-purple-200">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-purple-500 rounded-full p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-purple-800">
                    Resultados personalizados
                  </h3>
                  <p className="text-purple-700">
                    Mostrando {aiRecommendedJobs.length} empleos que coinciden
                    con tu perfil.
                  </p>
                </div>
                <button
                  className="ml-auto text-purple-700 hover:text-purple-900"
                  onClick={() => setAiRecommendedJobs(null)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {(aiRecommendedJobs || paginatedJobs).length > 0 ? (
              (aiRecommendedJobs || paginatedJobs).map((job, index) => (
                <JobCard
                  key={index}
                  job={job}
                  isAIRecommended={!!aiRecommendedJobs}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">
                No se encontraron empleos que coincidan con los filtros
                seleccionados.
              </p>
            )}

            {!aiRecommendedJobs && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>

          <div className="space-y-4">
            {paginatedJobs.length > 0 ? (
              paginatedJobs.map((job, index) => (
                <JobCard key={index} job={job} />
              ))
            ) : (
              <p className="text-center text-gray-500">
                No se encontraron empleos que coincidan con los filtros
                seleccionados.
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
