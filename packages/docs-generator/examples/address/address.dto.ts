import { IsInt, IsOptional, IsString } from 'class-validator'
import { DTO } from '@appwise/express-dto-router'

export class AddressDTO extends DTO {
  static __dirname = __dirname

  @IsString()
  street: string

  @IsOptional()
  @IsInt()
  number?: number

  @IsString()
  city: string

  @IsString()
  country: string
}
