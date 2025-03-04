import {
  IMinisterios,
  IRegion,
  ICiudades,
  IAreaTrabajo,
  ITipoVacante,
} from "@/interfaces/filters.interface"
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"

interface AccordeonProps {
  ministerio: boolean
  salario: boolean
  ubicacion: boolean
  area: boolean
  tipo: boolean
}

interface Props {
  agregarFiltro: (filtro: string) => void
  quitarFiltro: (filtro: string) => void
  toggleAcordeon: (acordeon: string) => void
  filtrosActivos: string[]
  setFiltrosActivos: Dispatch<SetStateAction<string[]>>
  acordeonesAbiertos: AccordeonProps
  ministerios: IMinisterios[]
  regiones: IRegion[]
  ciudades: ICiudades[]
  areasTrabajo: IAreaTrabajo[]
  tiposVacantes: ITipoVacante[]
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
}: Props) {
  const [rangoSalario, setRangoSalario] = useState([12000, 2000000])
  const [instituciones, setInstituciones] =
    useState<IMinisterios[]>(ministerios)

  return (
    <div className="lg:col-span-1 text-black">
      <div className="bg-white rounded-lg shadow-md sticky top-4">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Filter className="mr-2 h-5 w-5 " />
              Filtros
            </h3>
            {filtrosActivos.length > 0 && (
              <button
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={() => setFiltrosActivos([])}
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
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-800"
                >
                  {filtro}
                  <button className="ml-2" onClick={() => quitarFiltro(filtro)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Acordeón de Ministerio */}
          <div className="border-b border-gray-200">
            <button
              className="flex justify-between items-center w-full py-3 text-left font-semibold"
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
                >
                  {instituciones.map((institucion, index) => (
                    <option key={index} value={institucion.name}>
                      {institucion.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Acordeón de Rango Salarial */}
          <div className="border-b border-gray-200">
            <button
              className="flex justify-between items-center w-full py-3 text-left font-semibold"
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
                  <span>${rangoSalario[0].toLocaleString()}</span>
                  <span>${rangoSalario[1].toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3000000"
                  step="10000"
                  value={rangoSalario[0]}
                  onChange={(e) => {
                    const newValue = Number.parseInt(e.target.value)
                    setRangoSalario([newValue, rangoSalario[1]])
                    agregarFiltro(
                      `Salario mínimo: $${newValue.toLocaleString()}`
                    )
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="3000000"
                  step="10000"
                  value={rangoSalario[1]}
                  onChange={(e) => {
                    const newValue = Number.parseInt(e.target.value)
                    setRangoSalario([rangoSalario[0], newValue])
                    agregarFiltro(
                      `Salario máximo: $${newValue.toLocaleString()}`
                    )
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm text-gray-500">Mínimo</label>
                    <input
                      type="number"
                      value={rangoSalario[0]}
                      onChange={(e) => {
                        const newValue = Number.parseInt(e.target.value)
                        setRangoSalario([newValue, rangoSalario[1]])
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Máximo</label>
                    <input
                      type="number"
                      value={rangoSalario[1]}
                      onChange={(e) => {
                        const newValue = Number.parseInt(e.target.value)
                        setRangoSalario([rangoSalario[0], newValue])
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Acordeón de Ubicación */}
          <div className="border-b border-gray-200">
            <button
              className="flex justify-between items-center w-full py-3 text-left font-semibold"
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
                >
                  {regiones.map((region, index) => (
                    <option key={index} value={region.name}>
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
                >
                  {ciudades.map((ciudad, index) => (
                    <option key={index} value={ciudad.name}>
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
              className="flex justify-between items-center w-full py-3 text-left font-semibold"
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
              <div className="pb-3 space-y-2 overflow-auto h-[200px]">
                {areasTrabajo.map(({ name, id }) => {
                  return (
                    <div key={id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={String(id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        onChange={(e) => {
                          if (e.target.checked) {
                            agregarFiltro(`Área: ${name}`)
                          } else {
                            quitarFiltro(`Área: ${name}`)
                          }
                        }}
                      />
                      <label htmlFor={String(id)} className="text-sm">
                        {name}
                      </label>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Acordeón de Tipo de Vacante */}
          <div className="border-b border-gray-200">
            <button
              className="flex justify-between items-center w-full py-3 text-left font-semibold"
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
              <div className="pb-3 space-y-2 overflow-auto h-[200px]">
                {tiposVacantes.map(({ name, id }) => (
                  <div key={id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          agregarFiltro(`Tipo: ${name}`)
                        } else {
                          quitarFiltro(`Tipo: ${name}`)
                        }
                      }}
                    />
                    <label className="text-sm">{name}</label>
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
