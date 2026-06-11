export function formatCurrencyINR(
  value: number | null | undefined
): string {

  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {

    return '₹0.00';

  }

  return new Intl.NumberFormat(
    'en-IN',
  
    {
      style: 'currency',

      currency: 'INR',

      minimumFractionDigits: 2,

      maximumFractionDigits: 2,}).format(Number(value))

}