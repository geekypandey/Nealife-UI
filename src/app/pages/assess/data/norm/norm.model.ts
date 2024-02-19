export interface INorm {
  id?: number;
  stanine?: number;
  percentile?: number;
  grade?: string;
  aspect?: string;
  trait?: string;
  value?: number;
  total?: number;
  traitId?: number;
  aspectId?: number;
  color?: string;
}

export class Norm implements INorm {
  constructor(
    public id?: number,
    public stanine?: number,
    public percentile?: number,
    public grade?: string,
    public aspect?: string,
    public trait?: string,
    public value?: number,
    public total?: number,
    public traitId?: number,
    public aspectId?: number
  ) {}
}
