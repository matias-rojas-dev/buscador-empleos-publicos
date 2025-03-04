import { IconJobs, IconInstitutions, IconApplicants } from "./Icons"
import StatCard from "./StatCard"

interface StatsProps {
  totalActivesJobs: number
  totalMinisterios: number
  totalAreas: number
}

export default function Stats({
  totalActivesJobs,
  totalMinisterios,
  totalAreas,
}: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        icon={<IconJobs />}
        title="Empleos Activos"
        value={totalActivesJobs.toLocaleString("es-CL")}
        description="oportunidades laborales disponibles en este momento"
        bgColor="border-blue-500"
        color="text-blue-500"
      />

      <StatCard
        icon={<IconInstitutions />}
        title="Instituciones"
        value={totalMinisterios}
        description="instituciones públicas ofrecen oportunidades laborales"
        bgColor="border-purple-500"
        color="text-purple-500"
      />

      <StatCard
        icon={<IconApplicants />}
        title="Áreas de Trabajo"
        value={totalAreas}
        description="distintas áreas de trabajo"
        bgColor="border-red-500"
        color="text-red-500"
      />
    </div>
  )
}
