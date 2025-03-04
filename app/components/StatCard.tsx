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
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden border-t-4 ${bgColor}`}
    >
      <div className="p-6 text-center">
        <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-medium text-lg mb-1 text-black">{title}</h3>
        <p className={`text-4xl font-bold text-blue-500 mb-2 ${color}`}>
          {value}
        </p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  )
}
