import { IconJobs, IconInstitutions, IconApplicants } from "./Icons"
import StatCard from "./StatCard"

interface StatsProps {
  totalActivesJobs: number
  totalMinisterios: number
}

export default function Stats({
  totalActivesJobs,
  totalMinisterios,
}: StatsProps) {
  return (
    <div className="grid grid-cols-1 my-4 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        icon={<IconJobs />}
        title="Empleos Activos"
        value={totalActivesJobs.toLocaleString("es-CL")}
        description="oportunidades laborales disponibles en este momento."
        bgColor="bg-blue-500/20"
        color="text-blue-500"
      />

      <StatCard
        icon={<IconInstitutions />}
        title="Instituciones"
        value={totalMinisterios}
        description="instituciones públicas ofrecen oportunidades laborales."
        bgColor="bg-green-500/20"
        color="text-green-500"
      />

      <StatCard
        icon={<IconApplicants />}
        title="Postulantes"
        value="50,000+"
        description="personas buscan oportunidades cada mes."
        bgColor="bg-purple-500/20"
        color="text-purple-500"
      />
    </div>
  )
}
