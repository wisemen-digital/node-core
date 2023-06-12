import {
  ValidationOptions,
  ValidatorConstraintInterface, ValidationArguments, registerDecorator,
  ValidatorConstraint,
  isUUID
} from 'class-validator'
import type { BaseEntity } from 'typeorm'

type UuidFunction = (object: unknown) => string | null | undefined
interface DepartmentModel extends BaseEntity {
  uuid: string
  departmentUuid: string | null
}

interface Relation { entity: (new () => DepartmentModel) & typeof BaseEntity, uuid: UuidFunction }
type ParsedRelation = Omit<Relation, 'uuid'> & { uuid?: string | null }
type ValidRelation = Omit<Relation, 'uuid'> & { uuid: string }

type Relations = Relation[]

export function IsInAnyDepartmentOf (
  relations: Relations,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isInAnyDepartmentOf',
      target: object.constructor,
      propertyName,
      constraints: [{ relations }],
      options: validationOptions,
      validator: IsInAnyDepartmentOfValidator
    })
  }
}

@ValidatorConstraint({ name: 'isInAnyDepartmentOf', async: false })
class IsInAnyDepartmentOfValidator implements ValidatorConstraintInterface {
  async validate (departmentUuid: string, args: ValidationArguments): Promise<boolean> {
    const { relations } = args.constraints[0] as { relations: Relations }

    const validRelations = this.getValidRelations(relations, args.object)
    if (validRelations.length === 0) {
      return true
    }

    for (const relation of validRelations) {
      const model = await relation.entity.findOneBy<DepartmentModel>({ uuid: relation.uuid })
      if (model?.departmentUuid === departmentUuid) {
        return true
      }
    }
    return false
  }

  defaultMessage (args: ValidationArguments): string {
    const { relations } = args.constraints[0] as { relations: Relations }

    const validRelations = this.getValidRelations(relations, args.object)
    const entityNamesWithUuids = validRelations.map(relation => `${relation.entity.name} with uuid ${relation.uuid}`).join(', ')

    return `${args.property} is not a department of ${entityNamesWithUuids}`
  }

  private getValidRelations (relations: Relations, object: unknown): ValidRelation[] {
    const parsedRelations: ParsedRelation[] = relations.map(relation => ({
      entity: relation.entity,
      uuid: relation.uuid(object)
    }))

    return parsedRelations.filter(this.isValidRelation)
  }

  private isValidRelation (relation: ParsedRelation): relation is ValidRelation {
    return relation.uuid != null && isUUID(relation.uuid)
  }
}
