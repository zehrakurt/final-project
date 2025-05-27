export function calculateTotalPrice(bears: Bear[]): number {
  return bears.reduce((total, bear) => total + bear.price, 0);
}
