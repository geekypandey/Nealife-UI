export interface ICompetencyAspect {
  id?: number;
  aspectId?: number;
  competencyId?: number;
}

export class CompetencyAspect implements ICompetencyAspect {
  constructor(
    public id?: number,
    public aspectId?: number,
    public competencyId?: number
  ) {}
}

export interface ICompetency {
  id?: number;
  name?: string;
  description?: string;
  aspects?: ICompetencyAspect[];
}

export class Competency implements ICompetency {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public aspects?: ICompetencyAspect[]
  ) {}
}
