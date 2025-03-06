import { useState } from "react"
import { formatCurrency } from "@/helpers/formatCurrency"
import type { Job } from "@/interfaces/job.interface"
import { Briefcase, Building2, DollarSign, MapPin } from "lucide-react"

interface Props {
  job: Job
  isAIRecommended?: boolean
}

export default function JobCard({ job, isAIRecommended = false }: Props) {
  const now = new Date()
  const [isClicked, setIsClicked] = useState(false)

  const cierreDate = new Date(job.fechaCierre)
  const diffMs = cierreDate.getTime() - now.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  const handleClick = () => {
    setIsClicked(true)
    window.open(job.url, "_blank")
  }

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
        isClicked ? "bg-zinc-100" : ""
      } `}
    >
      <div
        className={`p-5 border-l-4 ${
          isAIRecommended ? " border-purple-500 mb-4" : " border-blue-500"
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-black">
              {job.cargo}
            </h3>
            <p className="text-gray-500 mb-2">{job.institucion}</p>
          </div>
          <div className="flex ">
            <span className="ml-12 text-center text-xs  px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-lg ">
              {job.tipoVacante}
            </span>
            {isAIRecommended && (
              <span className="text-center ml-2 inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                  <line x1="16" y1="8" x2="2" y2="22"></line>
                  <line x1="17.5" y1="15" x2="9" y2="15"></line>
                </svg>
                Recomendado por IA
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center">
            <Building2 className="h-4 w-4 mr-2 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Ministerio</p>
              <p className="text-sm font-semibold text-black ">
                {job.ministerio}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Área de Trabajo</p>
              <p className="text-sm font-semibold text-black">
                {job.areaTrabajo}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Ubicación</p>
              <p className="text-sm font-semibold text-black">
                {job.region} - {job.ciudad}
              </p>
            </div>
          </div>
        </div>

        <hr className="my-4 border-gray-200" />

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 mr-1 text-green-600" />
            <span className="font-semibold text-black text-lg">
              Renta Bruta:{" "}
              {job.rentaBruta === "-"
                ? "-"
                : `$${formatCurrency(job.rentaBruta)}`}
            </span>
          </div>
          <p
            className={`${
              diffDays < 1 ? "text-red-600 font-semibold" : "text-gray-700"
            } text-sm`}
          >
            Cierre: {job.fechaCierre}
          </p>
        </div>
      </div>
    </div>
  )
}
