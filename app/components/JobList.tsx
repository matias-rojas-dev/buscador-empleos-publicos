import { useState } from "react"
import type { Job } from "@/interfaces/job.interface"
import JobCard from "./JobCard"
import SkeletonCard from "./SkeletonCard"
import Pagination from "./Pagination"

interface JobListProps {
  jobs: Job[]
  isLoading: boolean
  jobsPerPage?: number
}

export default function JobList({
  jobs,
  isLoading,
  jobsPerPage = 12,
}: JobListProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(jobs.length / jobsPerPage)
  const startIndex = (currentPage - 1) * jobsPerPage
  const endIndex = startIndex + jobsPerPage
  const paginatedJobs = jobs.slice(startIndex, endIndex)

  if (isLoading) {
    return (
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  return (
    <>
      {jobs.length > 0 && (
        <div className="mb-4 text-center text-gray-700 font-medium">
          Cantidad de empleos obtenidos: {jobs.length}
        </div>
      )}

      <div className="flex flex-wrap justify-center">
        {paginatedJobs.length > 0 ? (
          paginatedJobs.map((job, index) => <JobCard key={index} job={job} />)
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No se encontraron empleos.
          </p>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  )
}
