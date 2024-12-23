export function xgcd (a: number, b: number): [number, number, number] {
  let [old_r, r] = [a, b]
  let [old_s, s] = [1, 0]
  let [old_t, t] = [0, 1]

  while (r !== 0) {
    const quotient = Math.floor(old_r / r);
    [old_r, r] = [r, old_r - quotient * r];
    [old_s, s] = [s, old_s - quotient * s];
    [old_t, t] = [t, old_t - quotient * t]
  }

  return [old_r, old_s, old_t]
}
