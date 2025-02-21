"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import type { Job } from "@/interfaces/job.interface"
import JobList from "./JobList"
import Stats from "./Stats"

interface JobSearchProps {
  initialJobs: Job[]
}

export default function JobSearch({ initialJobs }: JobSearchProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [query, setQuery] = useState(searchParams.get("terms") || "")
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(initialJobs)

  useEffect(() => {
    if (query.trim() === "") {
      router.replace("?")
      setFilteredJobs(initialJobs)
      return
    }

    const encodedQuery = encodeURIComponent(query.trim().replace(/\s+/g, "+"))
    router.replace(`?terms=${encodedQuery}`)

    const filtered = initialJobs.filter(
      (job) =>
        job.cargo.toLowerCase().includes(query.toLowerCase()) ||
        job.ministerio.toLowerCase().includes(query.toLowerCase())
    )

    setFilteredJobs(filtered)
  }, [query, router])

  return (
    <>
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar empleos..."
          className="text-gray-900 flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
          aria-label="Términos de búsqueda"
        />
      </div>

      <p className="mt-2 text-xs text-gray-500">
        Escriba para filtrar empleos en tiempo real.
      </p>

      {filteredJobs.length === 0 && query.trim() !== "" && (
        <p className="text-center text-gray-500 mt-5">
          No se encontraron empleos.
        </p>
      )}

      {query.trim() === "" && <Stats totalActivesJobs={initialJobs.length} />}

      <JobList jobs={filteredJobs} isLoading={false} />
    </>
  )
}
