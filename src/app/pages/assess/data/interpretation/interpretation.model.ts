export interface IInterpretation {
  id?: number;
  high?: string;
  low?: string;
  medium?: string;
  interpretation1?: string;
  interpretation2?: string;
  interpretation3?: string;
  interpretation4?: string;
  interpretation5?: string;
  interpretation6?: string;
  aspectId?: number;
}

export class Interpretation implements IInterpretation {
  constructor(
    public id?: number,
    public high?: string,
    public low?: string,
    public medium?: string,
    public interpretation1?: string,
    public interpretation2?: string,
    public interpretation3?: string,
    public interpretation4?: string,
    public interpretation5?: string,
    public interpretation6?: string,
    public aspectId?: number
  ) {}
}
