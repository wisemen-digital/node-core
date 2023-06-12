import { DTO } from '@appwise/express-dto-router'
import { IsInt, Max, Min } from 'class-validator'

export class TimeDto extends DTO {
  @IsInt()
  @Min(0)
  @Max(23)
  public readonly hours: number

  @IsInt()
  @Min(0)
  @Max(59)
  public readonly minutes: number

  @IsInt()
  @Min(0)
  @Max(59)
  public readonly seconds: number
}
