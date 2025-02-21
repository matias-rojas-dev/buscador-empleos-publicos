export default function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-100 rounded w-1/2 mb-4"></div>
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-100 rounded w-full mb-2"></div>
        ))}
      </div>
      <div className="px-6 py-4 bg-gray-50">
        <div className="h-10 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  )
}
