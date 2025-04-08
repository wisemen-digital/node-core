import { snakeCase } from 'change-case'
import { DefaultNamingStrategy } from 'typeorm'

export class SnakeNamingStrategy extends DefaultNamingStrategy {
  tableName (className: string, customName: string | undefined): string {
    return customName ?? snakeCase(className)
  }

  columnName (
    propertyName: string,
    customName: string | undefined,
    embeddedPrefixes: string[]
  ): string {
    return (
      snakeCase(embeddedPrefixes.join('_'))
      + ((embeddedPrefixes.length > 0) ? '_' : '')
      + (customName ?? snakeCase(propertyName))
    )
  }

  relationName (propertyName: string): string {
    return snakeCase(propertyName)
  }

  joinColumnName (relationName: string, referencedColumnName: string): string {
    return snakeCase(relationName + '_' + referencedColumnName)
  }

  joinTableName (
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
    _secondPropertyName: string
  ): string {
    return snakeCase(
      firstTableName
      + '_'
      + firstPropertyName.replace(/\./gi, '_')
      + '_'
      + secondTableName
    )
  }

  joinTableColumnName (
    tableName: string,
    propertyName: string,
    columnName?: string
  ): string {
    return snakeCase(tableName + '_' + (columnName ?? propertyName))
  }
}
