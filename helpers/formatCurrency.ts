export const formatCurrency = (value: string): string => {
  if (!value || value === "0,00") return "-"

  const numericValue = parseFloat(value.replace(",", ".")) // Convertir a número
  return numericValue.toLocaleString("es-CL") // Formato de Chile
}
