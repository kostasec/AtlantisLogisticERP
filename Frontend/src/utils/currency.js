export function currency(amount, currencyCode = 'USD', options = {}) {
  // Formatiramo iznos kao broj sa decimlama
  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  }).format(amount);
  
  // Dodajemo valutni kod nakon iznosa
  return `${formattedAmount} ${currencyCode}`;
}

export function format(amount, options = {}) {
  return new Intl.NumberFormat('en-US', options).format(amount);
}

export function formatK(amount, currencyCode = 'USD', style = 'currency') {
  if (amount < 1) return amount.toString();
  return new Intl.NumberFormat('en-US', {
    style,
    currency: currencyCode,
    notation: 'compact',
    compactDisplay: 'short'
  }).format(amount);
}
