import {Response} from "express";

export class ApiResponse {
  constructor (
    private fn: (res: Response) => Promise<void> | void
  ) {}

  public async execute (res: Response): Promise<void> {
    await this.fn(res)
  }
}
