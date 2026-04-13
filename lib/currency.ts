export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatINRCompact(amount: number): string {
  if (amount >= 10000000) {
    return `Rs. ${(amount / 10000000).toFixed(2)} Cr`
  }

  if (amount >= 100000) {
    return `Rs. ${(amount / 100000).toFixed(1)} L`
  }

  return formatINR(amount)
}