import { NextResponse } from "next/server"
import OpenAI from "openai"
import type { Job } from "@/interfaces/job.interface"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

export async function POST(request: Request) {
  try {
    // 1. Leemos el body con userText y jobs
    const { userText, jobs } = (await request.json()) as {
      userText: string
      jobs: Job[]
    }

    if (!userText || !jobs) {
      return NextResponse.json(
        { error: "Faltan parámetros: userText o jobs" },
        { status: 400 }
      )
    }

    // 2. Construir un listado resumido de los empleos para enviarlos al prompt
    const jobsData = jobs.map((job) => ({
      id: job.cargo,
      titulo: job.cargo,
      ministerio: job.ministerio,
    }))

    // 3. Construir el prompt para OpenAI
    const prompt = `
      Analiza el siguiente perfil profesional y encuentra los empleos más adecuados de la lista proporcionada.
      
      PERFIL PROFESIONAL:
      ${userText}
      
      EMPLEOS DISPONIBLES (en formato JSON):
      ${JSON.stringify(jobsData)}
      
      Instrucciones:
      1. Analiza las habilidades, experiencia y preferencias del perfil profesional.
      2. Evalúa cada empleo y determina su compatibilidad con el perfil.
      3. Devuelve SOLO los IDs de los 5-10 empleos más compatibles, ordenados por relevancia.
      4. Formato de respuesta: un array de strings con los IDs, ejemplo: ["empleo-1", "empleo-3", "empleo-2"]
      5. Si encuentras palabras obscena, devuelve un arreglo vacío
    `

    // 4. Llamada a Chat Completions usando tu API Key
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // o "gpt-4" / "gpt-4o" si lo tienes habilitado
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    })

    const text = response.choices?.[0]?.message?.content || ""

    // 5. Intentar parsear un array JSON del texto
    let matchedIds: string[] = []
    try {
      const match = text.match(/\[.*?\]/s)
      if (match) {
        matchedIds = JSON.parse(match[0])
      }
    } catch (parseError) {
      console.error("[analyzeJobMatch API] Error al parsear IDs:", parseError)
    }

    console.log(matchedIds)

    // 6. Devolvemos al cliente los IDs que se parsearon
    return NextResponse.json({ matchedIds })
  } catch (error) {
    console.error("[analyzeJobMatch API] Error interno:", error)
    return NextResponse.json(
      { error: "Error interno al procesar la solicitud" },
      { status: 500 }
    )
  }
}
