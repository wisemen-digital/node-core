export interface MonetaryObject<C extends string, P extends number> {
  amount: number,
  currency: C, 
  precision: P
}
