export function lcm (a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b)
}

export function gcd (a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b !== 0) {
    const t = b
    b = a % b
    a = t
  }
  return a
}
