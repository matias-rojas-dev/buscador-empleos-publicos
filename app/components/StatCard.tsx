interface Props {
  icon: React.ReactNode
  title: string
  value: string | number
  description: string
  bgColor: string
  color: string
}

export default function StatCard({
  icon,
  title,
  value,
  description,
  bgColor,
  color,
}: Props) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center border border-gray-200">
      <div className={`p-4 rounded-full ${bgColor}`}>{icon}</div>
      <h2 className="text-lg font-semibold text-gray-900 mt-4">{title}</h2>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
      <p className="text-gray-600 text-sm text-center mt-2">{description}</p>
    </div>
  )
}
