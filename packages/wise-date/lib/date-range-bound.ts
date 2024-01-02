export enum DateRangeBound {
  INCLUSIVE = 0,
  EXCLUSIVE = 1
}

export function isInclusive(bound: DateRangeBound) {
  return bound === DateRangeBound.INCLUSIVE
}

export function intersect(firstBound: DateRangeBound, secondBound: DateRangeBound): DateRangeBound {
  if(isInclusive(firstBound) && isInclusive(secondBound)) {
    return DateRangeBound.INCLUSIVE
  } else {
    return DateRangeBound.EXCLUSIVE
  }
}
