export const formatDate = (date: Date): string => {
  const pad = (num: number): string => String(num).padStart(2, "0")

  const day: string = pad(date.getDate())
  const month: string = pad(date.getMonth() + 1) // Los meses inician en 0
  const year: number = date.getFullYear()
  const hours: string = pad(date.getHours())
  const minutes: string = pad(date.getMinutes())
  const seconds: string = pad(date.getSeconds())

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}
