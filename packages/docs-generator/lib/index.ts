import "reflect-metadata"
import YAML from 'yaml'
import fs from 'fs'
import { targetConstructorToSchema } from 'class-validator-jsonschema'
import { ValidationTypes } from 'class-validator'


function getPropType(target: object, property: string) {
  return Reflect.getMetadata('design:type', target, property)
}

const additionalConverters = {
  [ValidationTypes.NESTED_VALIDATION]: (meta, options) => {
    if (typeof meta.target === 'function') {
      const typeMeta = options.classTransformerMetadataStorage
        ? options.classTransformerMetadataStorage.findTypeMetadata(
            meta.target,
            meta.propertyName
          )
        : null
      const childType = typeMeta
        ? typeMeta.typeFunction()
        : getPropType(meta.target.prototype, meta.propertyName)
      
      
      createSchema(childType)

      const path = childType.__dirname.replace(__dirname + '/', '') + '/'
      const filename = childType.name + '.yaml'

      return { $ref: options.refPointerPrefix + path + filename }
    }
  },
}

export function createSchema (DTO: any) {
  const schema = targetConstructorToSchema(DTO, { refPointerPrefix: './docs/', additionalConverters: additionalConverters })
  const yaml = YAML.stringify(schema)
  const filename = DTO.name + '.yaml'
  const path = DTO.__dirname.replace(__dirname + '/', '')
  fs.mkdirSync(`docs/${path}`, { recursive: true });
  fs.writeFileSync(`docs/${path}/${filename}`, yaml);
}
