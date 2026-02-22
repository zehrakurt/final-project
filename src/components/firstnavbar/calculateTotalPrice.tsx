import { CartItem } from '../../store/sepet';

export function calculateTotalPrice(bears: CartItem[]): number {
  return bears.reduce((total, bear) => total + bear.price, 0);
}
