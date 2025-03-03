import { formatCurrency } from "@/helpers/formatCurrency"
import type { Job } from "@/interfaces/job.interface"
import AlertFinishJob from "./AlertFinishJob"

interface Props {
  job: Job
}

export default function JobCard({ job }: Props) {
  const now = new Date()

  const cierreDate = new Date(job.fechaCierre)
  const diffMs = cierreDate.getTime() - now.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  console.log(diffDays)
  return (
    <div className="relative w-full md:w-[calc(50%-1rem)] lg:w-[calc(24.333%-1rem)] h-[600px] mx-2 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
      {diffDays <= 2 && <AlertFinishJob />}
      <div className="p-6 flex-grow overflow-auto">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 line-clamp-2">
          {job.cargo}
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-2">{job.institucion}</p>
        <div className="space-y-2 text-sm">
          <InfoRow label="Ministerio" value={job.ministerio} />
          <InfoRow label="Área de Trabajo" value={job.areaTrabajo} />
          <InfoRow label="Región" value={job.region} />
          <InfoRow label="Ciudad" value={job.ciudad} />
          <InfoRow label="Tipo de Vacante" value={job.tipoVacante} />
          <InfoRow
            label="Renta Bruta"
            value={
              job.rentaBruta === "-"
                ? "-"
                : `$${formatCurrency(job.rentaBruta)}`
            }
          />

          <InfoRow label="Fecha de Inicio" value={job.fechaInicio} />
          <InfoRow label="Fecha de Cierre" value={job.fechaCierre} />
          <InfoRow label="Tipo de Postulación" value={job.tipoPostulacion} />
          <InfoRow label="Cargo Profesional" value={job.cargoProfesional} />
        </div>
      </div>
      <div className="p-6 border-t">
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center px-4 py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition duration-300 ease-in-out"
        >
          Ver Detalles
        </a>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex flex-wrap">
      <span className="font-medium text-gray-900 mr-1">{label}:</span>
      <span className="text-gray-600 break-words">{value}</span>
    </p>
  )
}
