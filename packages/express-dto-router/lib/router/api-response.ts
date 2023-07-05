import {Response} from "express";

export class ApiResponse {
  constructor (
    private fn: (res: Response) => void
  ) {}

  public execute (res: Response): void {
    this.fn(res)
  }
}
