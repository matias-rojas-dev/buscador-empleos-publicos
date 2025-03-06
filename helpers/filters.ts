import { Job } from "@/interfaces/job.interface"
import {
  IAreaTrabajo,
  ICiudad,
  IMinisterios,
  IRegion,
  ITipoVacante,
} from "@/interfaces/filters.interface"

export const filterByMinisterio = (jobs: Job[]): IMinisterios[] => {
  const ministerios = [
    ...Array.from(new Set(jobs.map((job) => job.ministerio))),
  ]

  return ministerios.map((ministerio, index) => ({
    id: index + 1,
    name: ministerio,
  }))
}

export const filtersByRegion = (jobs: Job[]): IRegion[] => {
  const regiones = [...Array.from(new Set(jobs.map((job) => job.region)))]

  return regiones.map((region, index) => ({
    id: index + 1,
    name: region,
  }))
}

export const filtersByCiudad = (jobs: Job[]): ICiudad[] => {
  const ciudades = Array.from(
    new Set(
      jobs
        .map((job) => (job.ciudad || "").trim())
        .filter((ciudad) => ciudad !== "")
    )
  )
  return ciudades.map((ciudad, index) => ({
    id: index + 1,
    name: ciudad,
  }))
}

export const filtersAreaTrabajo = (jobs: Job[]): IAreaTrabajo[] => {
  const areasTrabajo = Array.from(
    new Set(
      jobs
        .map((job) => (job.areaTrabajo || "").trim())
        .filter((areaTrabajo) => areaTrabajo !== "")
    )
  )

  return areasTrabajo.map((areaTrabajo, index) => ({
    id: index + 1,
    name: areaTrabajo,
  }))
}

export const filtersTipoVacante = (jobs: Job[]): ITipoVacante[] => {
  const tipoVacantes = Array.from(
    new Set(
      jobs
        .map((job) => (job.tipoVacante || "").trim())
        .filter((tipoVacante) => tipoVacante !== "")
    )
  )
  return tipoVacantes.map((ciudad, index) => ({
    id: index + 1,
    name: ciudad,
  }))
}
