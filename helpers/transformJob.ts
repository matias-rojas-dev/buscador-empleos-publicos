import { Job } from "@/interfaces/job.interface"

export interface ApiJobs {
  Ministerio: string
  "Institución / Entidad": string
  Cargo: string
  "Área de Trabajo": string
  Región: string
  Ciudad: string
  "Tipo de Vacante": string
  "Renta Bruta": string
  "Fecha Inicio": string
  "Fecha Cierre Convocatoria": string
  url: string
  "Tipo postulacion": string
  "Cargo Profesional": string
  esPrimerEmpleo: boolean
  TipoTxt: string
  Priorizado: string
}

export function transformJob(apiJobs: ApiJobs[]): Job[] {
  return apiJobs.map((apiJob) => {
    return {
      ministerio: apiJob.Ministerio,
      institucion: apiJob["Institución / Entidad"],
      cargo: apiJob.Cargo,
      areaTrabajo: apiJob["Área de Trabajo"],
      region: apiJob.Región,
      ciudad: apiJob.Ciudad,
      tipoVacante: apiJob["Tipo de Vacante"],
      rentaBruta:
        apiJob["Renta Bruta"] === "0,00" ? "-" : apiJob["Renta Bruta"],
      fechaInicio: apiJob["Fecha Inicio"],
      fechaCierre: apiJob["Fecha Cierre Convocatoria"],
      url: apiJob.url,
      tipoPostulacion: apiJob["Tipo postulacion"],
      cargoProfesional: apiJob["Cargo Profesional"],
    }
  })
}
