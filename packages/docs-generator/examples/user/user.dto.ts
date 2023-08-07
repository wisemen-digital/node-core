import { IsObject, IsOptional, IsString, ValidateNested, IsUUID, MinLength, IsEmail } from 'class-validator'
import { Type } from 'class-transformer'
import { DTO } from '@appwise/express-dto-router'
import { AddressDTO } from '../address/address.dto'

export class UserDTO extends DTO {
  static __dirname = __dirname

  @IsString()
  @IsUUID()
  uuid: string

  @IsOptional()
  @IsString()
  firstName?: string

  @IsString()
  @MinLength(2)
  lastName: string

  @IsString()
  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  @MinLength(10)
  phoneNumber: string

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDTO)
  address?: AddressDTO
}
