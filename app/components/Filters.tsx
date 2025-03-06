"use client"

import { useState, useEffect } from "react"
import { Filter, ChevronUp, ChevronDown, X } from "lucide-react"
import type {
  IMinisterios,
  IRegion,
  ICiudad,
  IAreaTrabajo,
  ITipoVacante,
} from "@/interfaces/filters.interface"

interface FiltersProps {
  agregarFiltro: (filtro: string) => void
  quitarFiltro: (filtro: string) => void
  toggleAcordeon: (acordeon: string) => void
  filtrosActivos: string[]
  setFiltrosActivos: (filtros: string[]) => void
  acordeonesAbiertos: {
    ministerio: boolean
    salario: boolean
    ubicacion: boolean
    area: boolean
    tipo: boolean
  }
  ministerios: IMinisterios[]
  regiones: IRegion[]
  ciudades: ICiudad[]
  areasTrabajo: IAreaTrabajo[]
  tiposVacantes: ITipoVacante[]
  rangoSalarioActual: string | null
  maxSalary: number
  minSalary: number
}

export default function Filters({
  agregarFiltro,
  quitarFiltro,
  toggleAcordeon,
  filtrosActivos,
  setFiltrosActivos,
  acordeonesAbiertos,
  ministerios,
  regiones,
  ciudades,
  areasTrabajo,
  tiposVacantes,
  rangoSalarioActual,
  maxSalary,
  minSalary,
}: FiltersProps) {
  const [rangoSalario, setRangoSalario] = useState<[number, number]>([
    minSalary,
    maxSalary,
  ])

  useEffect(() => {
    if (rangoSalarioActual) {
      const range = rangoSalarioActual.replace("Salario: ", "").split("-")
      const min = Number.parseInt(range[0], 10)
      const max = Number.parseInt(range[1], 10)
      setRangoSalario([min, max])
    } else {
      setRangoSalario([minSalary, maxSalary])
    }
  }, [rangoSalarioActual])

  const limpiarFiltros = () => {
    setFiltrosActivos([])
  }

  const actualizarRangoSalario = (min: number, max: number) => {
    const newMin = Math.min(min, max)
    const newMax = Math.max(newMin, max)

    setRangoSalario([newMin, newMax])
    agregarFiltro(`Salario: ${newMin}-${newMax}`)
  }

  const handleChangeMin = (valor: number) => {
    if (valor > rangoSalario[1]) {
      valor = rangoSalario[1]
    }
    actualizarRangoSalario(valor, rangoSalario[1])
  }

  const handleChangeMax = (valor: number) => {
    if (valor < rangoSalario[0]) {
      valor = rangoSalario[0]
    }
    actualizarRangoSalario(rangoSalario[0], valor)
  }

  return (
    <div className="lg:col-span-1 text-black">
      <div className="bg-white rounded-lg shadow-md sticky top-4">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filtros
            </h3>
            {filtrosActivos.length > 0 && (
              <button
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={limpiarFiltros}
              >
                Limpiar
              </button>
            )}
          </div>

          {filtrosActivos.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filtrosActivos.map((filtro) => (
                <span
                  key={filtro}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200"
                >
                  {filtro}
                  <button className="ml-2" onClick={() => quitarFiltro(filtro)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="border-b border-gray-200">
            <button
              className="flex justify-between items-center w-full py-3 text-left font-medium"
              onClick={() => toggleAcordeon("ministerio")}
            >
              Ministerio
              {acordeonesAbiertos.ministerio ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {acordeonesAbiertos.ministerio && (
              <div className="pb-3">
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    agregarFiltro(
                      `Ministerio: ${
                        e.target.options[e.target.selectedIndex].text
                      }`
                    )
                  }
                  value=""
                >
                  <option value="">Seleccionar ministerio</option>
                  {ministerios?.map((ministerio) => (
                    <option key={ministerio.id} value={ministerio.id}>
                      {ministerio.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="border-b border-gray-200">
            <button
              className="flex justify-between items-center w-full py-3 text-left font-medium"
              onClick={() => toggleAcordeon("salario")}
            >
              Rango Salarial
              {acordeonesAbiertos.salario ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {acordeonesAbiertos.salario && (
              <div className="pb-3 space-y-4">
                <div className="flex justify-between text-sm">
                  <span>
                    ${rangoSalario[0].toLocaleString().replaceAll(",", ".")}
                  </span>
                  <span>
                    ${rangoSalario[1].toLocaleString().replaceAll(",", ".")}
                  </span>
                </div>

                {/* Range para mínimo */}
                <input
                  type="range"
                  min="0"
                  max={maxSalary}
                  step={minSalary}
                  value={rangoSalario[0]}
                  onChange={(e) => {
                    const newValue = Number.parseInt(e.target.value)
                    handleChangeMin(newValue)
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />

                {/* Range para máximo */}
                <input
                  type="range"
                  min="0"
                  max={maxSalary}
                  step={minSalary}
                  value={rangoSalario[1]}
                  onChange={(e) => {
                    const newValue = Number.parseInt(e.target.value)
                    handleChangeMax(newValue)
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />

                <div className="grid grid-cols-2 gap-2">
                  {/* Input numérico para mínimo */}
                  {/* <div>
                    <label className="text-sm text-gray-500">Mínimo</label>
                    <input
                      type="number"
                      value={rangoSalario[0]}
                      onChange={(e) => {
                        const newValue = Number.parseInt(e.target.value)
                        handleChangeMin(newValue.toLocaleString())
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div> */}

                  {/* Input numérico para máximo */}
                  {/* <div>
                    <label className="text-sm text-gray-500">Máximo</label>
                    <input
                      type="number"
                      value={rangoSalario[1]}
                      onChange={(e) => {
                        const newValue = Number.parseInt(e.target.value)
                        handleChangeMax(newValue)
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div> */}
                </div>
              </div>
            )}
          </div>

          {/* Acordeón de Ubicación */}
          <div className="border-b border-gray-200">
            <button
              className="flex justify-between items-center w-full py-3 text-left font-medium"
              onClick={() => toggleAcordeon("ubicacion")}
            >
              Ubicación
              {acordeonesAbiertos.ubicacion ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {acordeonesAbiertos.ubicacion && (
              <div className="pb-3 space-y-3">
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    agregarFiltro(
                      `Región: ${e.target.options[e.target.selectedIndex].text}`
                    )
                  }
                  value=""
                >
                  <option value="">Seleccionar región</option>
                  {regiones?.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>

                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    agregarFiltro(
                      `Ciudad: ${e.target.options[e.target.selectedIndex].text}`
                    )
                  }
                  value=""
                >
                  <option value="">Seleccionar ciudad</option>
                  {ciudades?.map((ciudad) => (
                    <option key={ciudad.id} value={ciudad.id}>
                      {ciudad.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Acordeón de Área de Trabajo */}
          <div className="border-b border-gray-200">
            <button
              className="flex justify-between items-center w-full py-3 text-left font-medium"
              onClick={() => toggleAcordeon("area")}
            >
              Área de Trabajo
              {acordeonesAbiertos.area ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>

            {acordeonesAbiertos.area && (
              <div className="pb-3 space-y-2 overflow-y-auto h-[200px]">
                {areasTrabajo?.map((area) => (
                  <div key={area.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`area-${area.id}`}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          agregarFiltro(`Área: ${area.name}`)
                        } else {
                          quitarFiltro(`Área: ${area.name}`)
                        }
                      }}
                      checked={filtrosActivos.includes(`Área: ${area.name}`)}
                    />
                    <label htmlFor={`area-${area.id}`} className="text-sm">
                      {area.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Acordeón de Tipo de Vacante */}
          <div className="border-b border-gray-200">
            <button
              className="flex justify-between items-center w-full py-3 text-left font-medium"
              onClick={() => toggleAcordeon("tipo")}
            >
              Tipo de Vacante
              {acordeonesAbiertos.tipo ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {acordeonesAbiertos.tipo && (
              <div className="pb-3 space-y-2 overflow-y-auto h-[200px]">
                {tiposVacantes?.map((tipo) => (
                  <div key={tipo.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`tipo-${tipo.id}`}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          agregarFiltro(`Tipo: ${tipo.name}`)
                        } else {
                          quitarFiltro(`Tipo: ${tipo.name}`)
                        }
                      }}
                      checked={filtrosActivos.includes(`Tipo: ${tipo.name}`)}
                    />
                    <label htmlFor={`tipo-${tipo.id}`} className="text-sm">
                      {tipo.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
