import { IsOptional, IsString } from 'class-validator';
import { ControllerOptions, Dto, DtoRouter } from '../lib';

class CreateUserDto extends Dto {
  // @IsOptional()
  name?: string
}

class Controller {
  async createUser ({ body }: ControllerOptions<{ body: CreateUserDto }>) {
    console.log(body.name)
  }
}

export const router = new DtoRouter()

const controller = new Controller()

router.post({
  path: '/',
  dtos: { body: CreateUserDto},
  controller: async ({ body }) => {
    console.log(body.name)
  }
})

router.post({
  path: '/',
  dtos: { body: CreateUserDto},
  controller: controller.createUser
})


