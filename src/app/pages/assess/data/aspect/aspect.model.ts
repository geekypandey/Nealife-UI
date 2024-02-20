export const enum AspectType {
  FACTOR = 'FACTOR',

  ABILITY = 'ABILITY',

  TRAIT = 'TRAIT',
}

export interface IAspectItem {
  id?: number;
  itemId?: number;
  aspectId?: number;
  responseOptionId?: number;
  responseOption?: string;
  responseOptionChoice?: string;
  choice?: string;
}

export class AspectItem implements IAspectItem {
  constructor(
    public id?: number,
    public itemId?: number,
    public aspectId?: number,
    public responseOptionId?: number,
    public responseOption?: string,
    public responseOptionChoice?: string,
    public choice?: string
  ) {}
}

export interface IAspect {
  id?: number;
  name?: string;
  description?: string;
  type?: AspectType;
  interpretationsId?: number;
  traits?: IAspect[];
  items?: IAspectItem[];
  parentId?: number;
}

export class Aspect implements IAspect {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public type?: AspectType,
    public interpretationsId?: number,
    public traits?: IAspect[],
    public items?: IAspectItem[],
    public parentId?: number
  ) {}
}
