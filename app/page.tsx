import { transformJob } from '@/helpers/transformJob'
import JobSearch from './components/JobSearch'
import { getJobs } from './lib/api'
import type { Job } from '@/interfaces/job.interface'
import Footer from './components/Footer'
import {
  filterByMinisterio,
  filtersAreaTrabajo,
  filtersByCiudad,
  filtersByRegion,
  filtersTipoVacante,
} from '@/helpers/filters'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const initialJobs = await getJobs()
  const transformedJobs: Job[] = transformJob(initialJobs)
  const ministerios = filterByMinisterio(transformedJobs)
  const regiones = filtersByRegion(transformedJobs)
  const ciudades = filtersByCiudad(transformedJobs)
  const tiposVacantes = filtersTipoVacante(transformedJobs)
  const areasTrabajo = filtersAreaTrabajo(transformedJobs)

  return (
    <main className="flex lg:justify-center flex-col lg:w-full">
      <div className="m-2 lg:m-10 lg:mx-1">
        <h1 className="text-5xl font-extrabold text-center text-black mb-4 tracking-tight">
          Buscador de Empleos Públicos
        </h1>
        <div className="w-64 h-1 mx-auto mb-8 flex">
          <div className="w-1/2 h-full bg-blue-500"></div>
          <div className="w-1/2 h-full bg-red-500"></div>
        </div>

        {transformedJobs.length > 0 ? (
          <JobSearch
            jobs={transformedJobs}
            ministerios={ministerios}
            regiones={regiones}
            ciudades={ciudades}
            tiposVacantes={tiposVacantes}
            areasTrabajo={areasTrabajo}
          />
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
