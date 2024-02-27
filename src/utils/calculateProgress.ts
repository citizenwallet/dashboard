export function calculateProgress(x: number, y: number) {
  if (y === 0) {
    return 0;
  }
  const progress = (x / y) * 100;
  return Math.max(0, Math.min(progress, 100));
}
