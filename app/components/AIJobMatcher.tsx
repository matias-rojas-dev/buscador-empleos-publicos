"use client"
import { useState, useRef, useEffect } from "react"
import type { Job } from "@/interfaces/job.interface"
import { analyzeJobMatch } from "../lib/analyzeJobMatch"

interface AIJobMatcherProps {
  jobs: Job[]
  onRecommendations: (jobs: Job[]) => void
}

export default function AIJobMatcher({
  jobs,
  onRecommendations,
}: AIJobMatcherProps) {
  const [userText, setUserText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [charCount, setCharCount] = useState(0)
  const [isValid, setIsValid] = useState(false)
  const [cooldownActive, setCooldownActive] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const MIN_CHARS = 500
  const COOLDOWN_MS = 20000 // 20 segundos

  useEffect(() => {
    setCharCount(userText.length)
    setIsValid(userText.length <= MIN_CHARS)
  }, [userText])

  const handleAnalyze = async () => {
    if (!isValid || isAnalyzing || cooldownActive) return

    try {
      setIsAnalyzing(true)
      setError(null)

      const recommendedJobs = await analyzeJobMatch(userText, jobs)
      onRecommendations(recommendedJobs)
    } catch (err) {
      console.error("Error al analizar con IA:", err)
      setError(
        "Ocurrió un error al analizar tu perfil. Por favor, intenta nuevamente."
      )
    } finally {
      setIsAnalyzing(false)
      setCooldownActive(true)
      setTimeout(() => {
        setCooldownActive(false)
      }, COOLDOWN_MS)
    }
  }

  const insertExample = () => {
    const exampleText = `Soy un profesional con más de 5 años de experiencia en el área de desarrollo de software. Me especializo en tecnologías web como React, Node.js y bases de datos SQL y NoSQL. He trabajado en proyectos de comercio electrónico, sistemas de gestión y aplicaciones móviles.

Mi formación incluye una licenciatura en Ingeniería Informática y certificaciones en desarrollo web full-stack. Tengo habilidades en gestión de proyectos ágiles, trabajo en equipo y comunicación efectiva.`
    setUserText(exampleText)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  return (
    <div className="text-black">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-purple-800 mb-2">
          Buscador inteligente de empleos
        </h2>
        <p className="text-gray-700">
          Ingresa tu CV, carta de presentación o descripción detallada de tu
          perfil profesional (mínimo {MIN_CHARS} caracteres). Nuestra IA
          analizará tu texto y encontrará los empleos que mejor se adapten a tus
          habilidades y experiencia.
        </p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="profile-text"
            className="block text-sm font-medium text-gray-700"
          >
            Tu perfil profesional
          </label>
          <span
            className={`text-sm ${
              isValid ? "text-green-600" : "text-gray-500"
            }`}
          >
            {charCount}/{MIN_CHARS} caracteres
          </span>
        </div>

        <textarea
          ref={textareaRef}
          id="profile-text"
          rows={10}
          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
            isValid
              ? "border-green-300 focus:ring-green-500"
              : "border-gray-300 focus:ring-purple-500"
          }`}
          placeholder="Describe tu experiencia, habilidades, formación académica y objetivos profesionales..."
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
        />

        <div className="flex justify-between mt-2">
          <button
            type="button"
            onClick={insertExample}
            className="text-purple-600 text-sm hover:text-purple-800"
          >
            Insertar ejemplo
          </button>

          {!isValid && (
            <p className="text-sm text-amber-600">
              Ingresa al menos {MIN_CHARS} caracteres para un mejor análisis
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleAnalyze}
          // Se deshabilita si no es válido, si está analizando o si está en cooldown
          disabled={!isValid || isAnalyzing || cooldownActive}
          className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-colors ${
            !isValid || isAnalyzing || cooldownActive
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
              <span>Analizando perfil...</span>
            </>
          ) : (
            <>
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
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              {cooldownActive ? (
                <span>En espera (20s)...</span>
              ) : (
                <span>Encontrar empleos para mi perfil</span>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
