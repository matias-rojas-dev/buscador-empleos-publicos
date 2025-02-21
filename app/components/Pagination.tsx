import React from "react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const visiblePages = 5

  const getPageNumbers = () => {
    let start = Math.max(1, currentPage - Math.floor(visiblePages / 2))
    const end = Math.min(totalPages, start + visiblePages - 1)

    if (end - start < visiblePages - 1) {
      start = Math.max(1, end - visiblePages + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 text-sm font-medium rounded-md ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "bg-gray-800 text-white hover:bg-gray-900"
        }`}
      >
        ←
      </button>

      <div className="hidden sm:flex space-x-1">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              currentPage === page
                ? "bg-gray-900 text-white font-bold"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <span className="sm:hidden text-sm font-medium text-gray-700">
        Página {currentPage} de {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 text-sm font-medium rounded-md ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "bg-gray-800 text-white hover:bg-gray-900"
        }`}
      >
        →
      </button>
    </div>
  )
}
