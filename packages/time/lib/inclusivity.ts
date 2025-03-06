export enum Inclusivity {
  INCLUSIVE = 0,
  EXCLUSIVE = 1
}

export type InclusivityString = '[]' | '()' | '[)' | '(]'

export function mapToInclusivity (str: InclusivityString): [Inclusivity, Inclusivity] {
  return [
    str[0] === '[' ? Inclusivity.INCLUSIVE : Inclusivity.EXCLUSIVE,
    str[1] === ']' ? Inclusivity.INCLUSIVE : Inclusivity.EXCLUSIVE
  ]
}

export function isInclusive (bound: Inclusivity) {
  return bound === Inclusivity.INCLUSIVE
}

export function intersect (firstBound: Inclusivity, secondBound: Inclusivity): Inclusivity {
  if (isInclusive(firstBound) && isInclusive(secondBound)) {
    return Inclusivity.INCLUSIVE
  } else {
    return Inclusivity.EXCLUSIVE
  }
}
