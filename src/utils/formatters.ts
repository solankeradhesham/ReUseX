/**
 * Format a number into Indian Rupee format (e.g. 1540000 -> ₹ 15,40,000)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹ 0';
  
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  return formatter.format(amount);
}

/**
 * Format large Indian amounts into short words (e.g. 1.85 Cr, 15.4 Lakhs, 98K)
 */
export function formatINRShort(amount: number): string {
  if (amount >= 10000000) {
    return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹ ${(amount / 100000).toFixed(2)} Lakh`;
  }
  if (amount >= 1000) {
    return `₹ ${(amount / 1000).toFixed(1)}k`;
  }
  return `₹ ${amount}`;
}

export function formatDate(dateString: string): string {
  return dateString;
}
