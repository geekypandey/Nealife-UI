export interface IResponseOption {
  id?: number;
  responseOption?: string;
  choices?: string;
}

export class ResponseOption implements IResponseOption {
  constructor(
    public id?: number,
    public responseOptionId?: string,
    public choices?: string
  ) {}
}
