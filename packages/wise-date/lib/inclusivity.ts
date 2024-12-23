export enum Inclusivity {
  INCLUSIVE = 0,
  EXCLUSIVE = 1
}

export function isInclusive(bound: Inclusivity) {
  return bound === Inclusivity.INCLUSIVE
}

export function intersect(firstBound: Inclusivity, secondBound: Inclusivity): Inclusivity {
  if(isInclusive(firstBound) && isInclusive(secondBound)) {
    return Inclusivity.INCLUSIVE
  } else {
    return Inclusivity.EXCLUSIVE
  }
}
