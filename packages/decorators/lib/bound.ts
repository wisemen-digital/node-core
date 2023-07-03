export function Bound<T extends new (...args: any[]) => object> (constructor: T): any {
  return class extends constructor {
    constructor (...args: any[]) {
      super(...args)

      const propertyNames =
        Object.getOwnPropertyNames(Object.getPrototypeOf(Object.getPrototypeOf(this)))
      const prototype = Object.getPrototypeOf(Object.getPrototypeOf(this))
      const instance = this

      propertyNames
        .filter(propertyName => prototype[propertyName] instanceof Function)
        .forEach(methodName => prototype[methodName] = prototype[methodName].bind(instance))
    }
  }
}
