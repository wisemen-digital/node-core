export abstract class Transformer <T, S, V = unknown> {
  item (entity: null, ...options: V[]): null
  item (entity: undefined, ...options: V[]): undefined
  item (entity: T, ...options: V[]): S
  item (entity: T | null,  ...options: V[]): S | null
  item (entity: T | undefined,  ...options: V[]): S | undefined
  item (entity?: T | null,  ...options: V[]): S | null | undefined
  item (entity?: T | null,  ...options: V[]): S | null | undefined {
    if (entity === undefined) return undefined
    if (entity === null) return null

    return this.transform(entity, ...options)
  }

  array (entities: null): null
  array (entities: undefined): undefined
  array (entities: T[]): S[]
  array (entities: T[] | null): S[] | null
  array (entities: T[] | undefined): S[] | undefined
  array (entities?: T[] | null): S[] | null | undefined
  array (entities?: T[] | null): S[] | null | undefined {
    if (entities === undefined) return undefined
    if (entities === null) return null

    return entities.map(entity => this.transform(entity))
  }

  protected abstract transform (_entity: T, ...options: V[]): S
}
