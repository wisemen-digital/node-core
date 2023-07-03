import {Bound} from "./bound.js";

export function Controller<T extends new (...args: any[]) => object> (constructor: T): any {
  return Bound(constructor)
}
