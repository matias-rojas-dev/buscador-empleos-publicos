// "use client"
// import { useEffect, useState } from "react"

// interface AlertFinishJobProps {
//   fechaCierre: string
// }

// export default function AlertFinishJob({ fechaCierre }: AlertFinishJobProps) {
//   const calculateTimeLeft = () => {
//     const now = new Date().getTime()
//     const target = new Date(fechaCierre).getTime()
//     const diffMs = target - now

//     if (diffMs <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

//     return {
//       days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
//       hours: Math.floor((diffMs / (1000 * 60 * 60)) % 24),
//       minutes: Math.floor((diffMs / (1000 * 60)) % 60),
//       seconds: Math.floor((diffMs / 1000) % 60),
//     }
//   }

//   const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft(calculateTimeLeft())
//     }, 1000)

//     return () => clearInterval(timer)
//   }, [])

//   return (
//     <div className=" absolute text-red-600 font-semibold text-sm text-center">
//       {timeLeft.days > 0 ? `${timeLeft.days} días, ` : ""}
//       {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s restantes
//     </div>
//   )
// }

export default function AlertFinishJob() {
  return (
    <div className="-top-4 rounded-md right-0 bg-red-600/80 p-2 absolute text-white font-semibold text-sm text-center">
      <h2>Esta oferta está pronto a terminar</h2>
    </div>
  )
}
