import { describe, it } from "node:test"
import { expect } from 'expect'
import {Bound} from "../bound.js";

describe('Bound decorator test', () => {
  it('Unbound classes have unbound methods',  () => {
    class Unbound {
      readonly variable: 0
      unboundMethod () {return this.variable}
    }
    const unboundInstance = new Unbound()
    let unboundMethod = unboundInstance.unboundMethod;
    expect(() => unboundMethod()).toThrow(TypeError)
  })

  it('Decorated classes have bound methods',  () => {
    @Bound
    class BoundClass {
      readonly variable: 0
      unboundMethod () {return this.variable}
    }
    const boundInstance = new BoundClass()
    let boundMethod = boundInstance.unboundMethod;
    expect(() => boundMethod()).not.toThrow()
  })
})
