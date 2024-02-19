export interface IItem {
  id?: number;
  key?: string;
  question?: string;
  fiHigh?: string;
  fiAboveAverage?: string;
  fiAverage?: string;
  fiBelowAverage?: string;
  fiLow?: string;
  choices?: string;
}

export class Item implements IItem {
  constructor(
    public id?: number,
    public key?: string,
    public question?: string,
    public fiHigh?: string,
    public fiAboveAverage?: string,
    public fiAverage?: string,
    public fiBelowAverage?: string,
    public fiLow?: string,
    public choices?: string
  ) {}
}
