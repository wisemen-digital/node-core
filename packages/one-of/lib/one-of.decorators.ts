import { ClassConstructor } from 'class-transformer'
import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptions,
  ApiResponse,
  getSchemaPath
} from '@nestjs/swagger'
import { applyDecorators, Type } from '@nestjs/common'
import { ReferenceObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface.js'
import { DECORATORS } from '@nestjs/swagger/dist/constants.js'
import { isFunction, isString } from '@nestjs/common/utils/shared.utils.js'
import { ApiResponseCommonMetadata } from '@nestjs/swagger/dist/decorators/api-response.decorator.js'
import { pascalCase } from './pascal-case.js'

export const ONE_OF_TYPE_API_PROPERTY = 'wisemen.one_of_type_api_property'
export const ONE_OF_META_API_PROPERTY = 'wisemen.one_of_meta_api_property'
export const ONE_OF_DISCRIMINATED_TYPES = 'wisemen.one_of_discriminated_types'
export const ONE_OF_DISCRIMINATED_RESPONSE = 'wisemen.one_of_discriminated_response'

type OneOfDiscriminatedTypes = Map<string, ClassConstructor<unknown>>
export type OneOfApiResponseOptions = Omit<ApiResponseCommonMetadata, 'type'>

export function OneOfTypeApiProperty (): PropertyDecorator {
  return (target: object, propertyKey: string) => {
    Reflect.defineMetadata(ONE_OF_TYPE_API_PROPERTY, propertyKey, target)
  }
}

export function OneOfMetaApiProperty (): PropertyDecorator {
  return (target: object, propertyKey: string) => {
    Reflect.defineMetadata(ONE_OF_META_API_PROPERTY, propertyKey, target)
  }
}

export function OneOfMeta (
  forClass: ClassConstructor<unknown>,
  discriminatorType: string
): ClassDecorator {
  return (target: object) => {
    const types: OneOfDiscriminatedTypes
      = Reflect.getMetadata(ONE_OF_DISCRIMINATED_TYPES, forClass) as OneOfDiscriminatedTypes
        ?? new Map<string, ClassConstructor<unknown>>()

    types.set(discriminatorType, target as ClassConstructor<unknown>)

    Reflect.defineMetadata(ONE_OF_DISCRIMINATED_TYPES, types, forClass)
    CALLBACKS.reRender(forClass)
  }
}

export function OneOfResponse (
  forClass: ClassConstructor<unknown>
): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(ONE_OF_DISCRIMINATED_RESPONSE, target, forClass)
    CALLBACKS.reRender(forClass)
  }
}

export function OneOfApiProperty (
  forClass: ClassConstructor<unknown>,
  options?: ApiPropertyOptions
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const decorators = new OneOfDecorators(forClass)
    const decorator = decorators.OneOfApiPropertyDecorator(options)

    CALLBACKS.subscribeApiProperty(forClass, target, propertyKey, options)

    return decorator(target, propertyKey)
  }
}

export function OneOfApiExtraModels (forClass: ClassConstructor<unknown>): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  return <TFunction extends Function>(target: TFunction) => {
    const decorators = new OneOfDecorators(forClass)
    const decorator = decorators.OneOfApiExtraModelsDecorator()

    CALLBACKS.subscribeApiExtraModels(forClass, target)

    return decorator(target)
  }
}

export function OneOfApiResponse (
  forClass: ClassConstructor<unknown>,
  options?: OneOfApiResponseOptions
): MethodDecorator {
  return <T>(
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) => {
    const decorators = new OneOfDecorators(forClass)
    const oneOfApiResponseDecorator = decorators.OneOfApiResponseDecorator(options)

    CALLBACKS.subscribeApiResponse(forClass, target, propertyKey, descriptor, options)

    return oneOfApiResponseDecorator(target, propertyKey, descriptor)
  }
}

interface PropertyDecoratorArgs {
  target: object
  propertyKey: string | symbol
  options?: ApiPropertyOptions
}

interface ClassDecoratorArgs {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  target: Function
}

interface MethodDecoratorArgs {
  target: object
  propertyKey: string | symbol
  descriptor: TypedPropertyDescriptor<unknown>
  options?: OneOfApiResponseOptions
}

class OneOfDecoratorCallbacks {
  private apiProperties: Map<ClassConstructor<unknown>, PropertyDecoratorArgs[]>
  private apiExtraModels: Map<ClassConstructor<unknown>, ClassDecoratorArgs[]>
  private apiResponses: Map<ClassConstructor<unknown>, MethodDecoratorArgs[]>

  constructor () {
    this.apiProperties = new Map()
    this.apiExtraModels = new Map()
    this.apiResponses = new Map()
  }

  subscribeApiProperty (
    toClass: ClassConstructor<unknown>,
    target: object,
    propertyKey: string | symbol,
    options?: ApiPropertyOptions
  ): void {
    const subscribers = this.apiProperties.get(toClass) ?? []

    subscribers.push({ target, propertyKey, options })
    this.apiProperties.set(toClass, subscribers)
  }

  subscribeApiExtraModels (
    toClass: ClassConstructor<unknown>,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    target: Function
  ): void {
    const subscribers = this.apiExtraModels.get(toClass) ?? []

    subscribers.push({ target })
    this.apiExtraModels.set(toClass, subscribers)
  }

  subscribeApiResponse (
    toClass: ClassConstructor<unknown>,
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<unknown>,
    options?: OneOfApiResponseOptions
  ): void {
    const subscribers = this.apiResponses.get(toClass) ?? []

    subscribers.push({ target, propertyKey, descriptor, options })
    this.apiResponses.set(toClass, subscribers)
  }

  reRender (ofClass: ClassConstructor<unknown>): void {
    const apiPropertySubscribers = this.apiProperties.get(ofClass) ?? []
    const extraModelsSubscribers = this.apiExtraModels.get(ofClass) ?? []
    const apiResponseSubscribers = this.apiResponses.get(ofClass) ?? []

    if (
      apiPropertySubscribers.length === 0
      && extraModelsSubscribers.length === 0
      && apiPropertySubscribers.length === 0
    ) {
      return
    }

    const decorators = new OneOfDecorators(ofClass)

    const apiPropertyDecorator = decorators.OneOfApiPropertyDecorator

    for (const subscriber of apiPropertySubscribers) {
      const subscribeDecorator = apiPropertyDecorator(subscriber.options)

      subscribeDecorator(subscriber.target, subscriber.propertyKey)
    }

    const extraModelsDecorator = decorators.OneOfApiExtraModelsDecorator()

    for (const subscriber of extraModelsSubscribers) {
      extraModelsDecorator(subscriber.target)
    }

    const apiResponseDecorator = decorators.OneOfApiResponseDecorator

    for (const subscriber of apiResponseSubscribers) {
      const subscribeDecorator = apiResponseDecorator(subscriber.options)

      subscribeDecorator(subscriber.target, subscriber.propertyKey, subscriber.descriptor)
    }
  }
}

const CALLBACKS = new OneOfDecoratorCallbacks()

class OneOfDecorators {
  private forClass: ClassConstructor<unknown>
  private discriminatedTypes: OneOfDiscriminatedTypes
  private responseClass: ClassConstructor<unknown>
  private discriminatedClasses: Map<string, ClassConstructor<unknown>>
  private dynamicClasses: Map<string, ClassConstructor<unknown>>
  private responseDecorator: (options?: OneOfApiResponseOptions) => MethodDecorator
  private propertyDecorator: (options?: ApiPropertyOptions) => PropertyDecorator
  private extraModelsDecorator: () => ClassDecorator

  constructor (forClass: ClassConstructor<unknown>) {
    this.forClass = forClass
    this.discriminatedTypes
      = Reflect.getMetadata(ONE_OF_DISCRIMINATED_TYPES, forClass) as OneOfDiscriminatedTypes
        ?? new Map<string, ClassConstructor<unknown>>()
    this.responseClass = this.extractResponseClass(forClass)

    this.discriminatedClasses = new Map()
    this.dynamicClasses = new Map()
    this.buildDynamicClasses()
    this.buildDecorators()
  }

  get OneOfApiResponseDecorator (): ((options?: OneOfApiResponseOptions) => MethodDecorator) {
    return this.responseDecorator
  }

  get OneOfApiPropertyDecorator (): ((options?: ApiPropertyOptions) => PropertyDecorator) {
    return this.propertyDecorator
  }

  get OneOfApiExtraModelsDecorator (): (() => ClassDecorator) {
    return this.extraModelsDecorator
  }

  private generateName (type: string): string {
    const kebabCase = type.replaceAll('.', '-')

    return pascalCase(kebabCase) + this.forClass.name
  }

  private generateDiscriminatedClass (type: string): ClassConstructor<unknown> {
    const discriminatedClass = this.discriminatedTypes.get(type)

    if (discriminatedClass === undefined) {
      throw new Error(`${type} not found on class ${this.forClass.name}`)
    }

    return discriminatedClass
  }

  private extractResponseClass (forClass: ClassConstructor<unknown>): ClassConstructor<unknown> {
    const responseClass = Reflect.getMetadata(
      ONE_OF_DISCRIMINATED_RESPONSE,
      forClass
    ) as ClassConstructor<undefined> | undefined

    if (responseClass === undefined) {
      throw new Error(
        `Response class missing for ${this.forClass.name}\n`
        + `Did you forget to add \x1b[31m@${OneOfResponse.name}(${this.forClass.name})\x1b[0m?`
      )
    }

    return responseClass
  }

  private buildDynamicClasses (): void {
    for (const type of this.discriminatedTypes.keys()) {
      this.discriminatedClasses.set(type, this.generateDiscriminatedClass(type))
      this.dynamicClasses.set(type, this.generateDynamicClass(type))
    }
  }

  private buildDecorators () {
    const extraModels = [...this.dynamicClasses.values(), ...this.discriminatedClasses.values()]
    const references = this.buildOpenApiReferences()

    this.propertyDecorator = (options?: ApiPropertyOptions): PropertyDecorator => {
      return ApiProperty({ ...options, oneOf: references })
    }

    this.extraModelsDecorator = (): ClassDecorator => {
      return ApiExtraModels(...extraModels)
    }

    this.responseDecorator = (options?: OneOfApiResponseOptions) => {
      return applyDecorators(
        ApiExtraModels(...extraModels),
        ApiResponse({ ...options, schema: { oneOf: references } })
      )
    }
  }

  private buildOpenApiReferences (): ReferenceObject[] {
    const references: ReferenceObject[] = []

    for (const type of this.discriminatedTypes.keys()) {
      references.push({ $ref: getSchemaPath(this.generateName(type)) })
    }

    return references
  }

  private generateDynamicClass (forType: string): ClassConstructor<unknown> {
    const dynamicClass = class {
    }

    this.addClassName(dynamicClass, this.generateName(forType))
    this.copyApiModelPropertiesMetadata(this.responseClass, dynamicClass)
    this.copyResponseApiPropertyMetadata(this.responseClass, dynamicClass)
    this.addDiscriminatorApiPropertyMetadata(forType, dynamicClass, this.responseClass)
    this.addDiscriminatedApiPropertyMetadata(forType, dynamicClass, this.responseClass)

    return dynamicClass
  }

  private addClassName (dynamicClass: ClassConstructor<unknown>, name: string): void {
    Object.defineProperty(dynamicClass, 'name', {
      value: name,
      writable: false
    })
  }

  private copyApiModelPropertiesMetadata (
    responseClass: ClassConstructor<unknown>,
    dynamicClass: ClassConstructor<unknown>
  ): void {
    const propertiesMetadata = Reflect.getMetadata(
      DECORATORS.API_MODEL_PROPERTIES_ARRAY,
      responseClass.prototype as Type<unknown>
    ) as Array<string>

    Reflect.defineMetadata(
      DECORATORS.API_MODEL_PROPERTIES_ARRAY,
      Array.from(propertiesMetadata),
      dynamicClass.prototype as Type<unknown>
    )
  }

  private copyResponseApiPropertyMetadata (
    responseClass: ClassConstructor<unknown>,
    dynamicClass: ClassConstructor<unknown>
  ): void {
    for (const property of this.getModelProperties(responseClass.prototype as Type<unknown>)) {
      const metaData: object = Reflect.getMetadata(
        DECORATORS.API_MODEL_PROPERTIES,
        responseClass.prototype as object,
        property
      ) as object

      const metaDataCopy = { ...metaData }

      const decorator = ApiProperty(metaDataCopy)

      decorator(dynamicClass.prototype as object, property)
    }
  }

  private addDiscriminatedApiPropertyMetadata (
    enumValue: string,
    dynamicClass: ClassConstructor<unknown>,
    responseClass: ClassConstructor<unknown>
  ): void {
    const discriminatedDecorator = ApiProperty({ type: this.generateDiscriminatedClass(enumValue) })
    const propertyName = this.extractMetaProperty(responseClass)

    discriminatedDecorator(dynamicClass.prototype as object, propertyName)
  }

  private addDiscriminatorApiPropertyMetadata (
    enumValue: string,
    dynamicClass: ClassConstructor<unknown>,
    responseClass: ClassConstructor<unknown>
  ): void {
    const discriminatorDecorator = ApiProperty({ type: 'string', enum: [String(enumValue)] })
    const propertyName = this.extractTypeProperty(responseClass)

    discriminatorDecorator(dynamicClass.prototype as object, propertyName)
  }

  private extractTypeProperty (responseClass: ClassConstructor<unknown>): string {
    const propertyName = Reflect.getMetadata(
      ONE_OF_TYPE_API_PROPERTY,
      responseClass.prototype as object
    ) as string | undefined

    if (propertyName === undefined) {
      throw new Error(
        `Response class ${responseClass.name} does not have a type property\n`
        + `Did you forget to add \x1b[31m@${OneOfTypeApiProperty.name}()\x1b[0m on the type property in ${responseClass.name}?`
      )
    }

    return propertyName
  }

  private extractMetaProperty (responseClass: ClassConstructor<unknown>): string {
    const propertyName = Reflect.getMetadata(
      ONE_OF_META_API_PROPERTY,
      responseClass.prototype as object
    ) as string | undefined

    if (propertyName === undefined) {
      throw new Error(
        `Response class ${responseClass.name} does not have a meta property\n`
        + `Did you forget to add \x1b[31m@${OneOfMetaApiProperty.name}()\x1b[0m on the meta property in ${responseClass.name}?`
      )
    }

    return propertyName
  }

  private getModelProperties (prototype: Type<unknown>): string[] {
    const properties = Reflect.getMetadata(
      DECORATORS.API_MODEL_PROPERTIES_ARRAY,
      prototype
    ) as Array<unknown> ?? []

    return properties
      .filter(isString)
      .filter((key: string) => key.charAt(0) === ':' && !isFunction(prototype[key]))
      .map((key: string) => key.slice(1))
  }
}
