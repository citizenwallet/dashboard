export function formatCurrency(
  num: bigint,
  decimalPlaces: number,
  maxDecimals: number
) {
  const factor = BigInt(Math.pow(10, decimalPlaces));
  const integerPart = Number(num / factor);
  const fractionalPart = Number(num % factor);
  const paddedFraction = String(fractionalPart).padStart(decimalPlaces, "0");
  return `${integerPart}.${paddedFraction.slice(0, maxDecimals)}`;
}
