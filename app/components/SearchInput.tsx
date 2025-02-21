"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface SearchInputProps {
  onSearch: (terms: string[]) => void
  hasSearched: boolean
  initialTerms: string[]
}

export default function SearchInput({
  onSearch,
  hasSearched,
  initialTerms,
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [searchTerms, setSearchTerms] = useState<string[]>(initialTerms)

  useEffect(() => {
    setSearchTerms(initialTerms)
  }, [initialTerms])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      addSearchTerm(inputValue.trim())
    } else {
      if (searchTerms.length > 0) {
        onSearch(searchTerms)
      }
    }
  }

  const addSearchTerm = (term: string) => {
    if (!searchTerms.includes(term)) {
      const newTerms = [...searchTerms, term]
      setSearchTerms(newTerms)
      onSearch(newTerms)
      setInputValue("")
    }
  }

  const removeSearchTerm = (termToRemove: string) => {
    const newTerms = searchTerms.filter((term) => term !== termToRemove)
    setSearchTerms(newTerms)
    onSearch(newTerms)
  }

  return (
    <div
      className={`flex flex-col items-center transition-all duration-500 ease-in-out ${
        hasSearched ? "transform -translate-y-16" : ""
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className="flex justify-center w-full max-w-2xl"
      >
        <div className="w-full flex flex-wrap gap-2 p-2 bg-gray-100 border border-gray-300 rounded-md min-h-[48px]">
          {searchTerms.map((term, index) => (
            <span
              key={index}
              className="flex items-center gap-1 px-3 py-1 bg-gray-900 text-white rounded-full text-sm"
            >
              {term}
              <button
                type="button"
                onClick={() => removeSearchTerm(term)}
                className="ml-1 hover:text-gray-300 focus:outline-none"
                aria-label={`Eliminar término ${term}`}
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder={
              searchTerms.length === 0
                ? "Ingrese palabras clave (ej: software, ingeniería)"
                : "Agregar más términos..."
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-1 bg-transparent border-none focus:outline-none text-gray-900"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 mx-2 font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-300 ease-in-out"
        >
          Buscar
        </button>
      </form>
      {searchTerms.length > 0 && (
        <p className="mt-2 text-sm text-gray-500">
          Presione Enter o haga clic en Buscar para agregar un término, o haga
          clic en × para eliminar
        </p>
      )}
    </div>
  )
}
