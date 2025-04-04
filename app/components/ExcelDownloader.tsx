"use client"
import { useState } from "react"
import { Download } from "lucide-react"
import { Job } from "@/interfaces/job.interface"

interface ExcelDownloaderProps {
  jobs: Job[]
}

export default function ExcelDownloader({ jobs }: ExcelDownloaderProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (jobs.length === 0) return

    try {
      setIsDownloading(true)

      const XLSX = await import("xlsx")

      const workbookData = jobs.map((job) => ({
        Título: job.cargo,
        Entidad: job.institucion,
        Ministerio: job.ministerio,
        "Área de Trabajo": job.areaTrabajo,
        "Tipo de Vacante": job.tipoVacante,
        Región: job.region,
        Ciudad: job.ciudad,
        "Renta Bruta": job.rentaBruta,
        "Fecha de Cierre": job.fechaCierre || "No especificada",
        URL: job.url,
      }))

      const worksheet = XLSX.utils.json_to_sheet(workbookData)

      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Empleos")

      const columnsWidth = [
        { wch: 40 }, // Título
        { wch: 30 }, // Entidad
        { wch: 25 }, // Ministerio
        { wch: 25 }, // Área de Trabajo
        { wch: 20 }, // Tipo de Vacante
        { wch: 20 }, // Región
        { wch: 15 }, // Ciudad
        { wch: 15 }, // Renta Bruta
        { wch: 15 }, // Días Restantes
        { wch: 15 }, // Fecha de Cierre
        { wch: 50 }, // URL
      ]
      worksheet["!cols"] = columnsWidth

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      })

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url

      const date = new Date()
      const formattedDate = `${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}`
      link.download = `empleos-filtrados-${formattedDate}.xlsx`

      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error al generar el archivo Excel:", error)
      alert(
        "Ocurrió un error al generar el archivo Excel. Por favor, intente nuevamente."
      )
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading || jobs.length === 0}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
        ${
          jobs.length === 0
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
    >
      {isDownloading ? (
        <>
          <div className="h-2 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
          <span>Generando Excel...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          <span>Descargar Excel</span>
        </>
      )}
    </button>
  )
}
