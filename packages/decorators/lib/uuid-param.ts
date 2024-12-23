import { Param, ParseUUIDPipe } from '@nestjs/common'

export function UuidParam (parameterName: string): ParameterDecorator {
  return Param(parameterName, ParseUUIDPipe)
}
