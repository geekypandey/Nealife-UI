export interface Profile {
  login: string;
  role: 'ROLE_SUPER_ADMIN';
  roleDisplayName: string;
  action: string;
  companyId: string;
  companyName: string;
  privilege: string[];
}

export interface Account {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  activated: boolean;
  langKey: string;
  createdBy: string;
  createdDate: null;
  lastModifiedBy: string;
  lastModifiedDate: string;
  authorities: string[];
  action: string;
  companyId: string;
  companyName: string;
  privilege: string[];
}

export interface CompetencyAspectProjections {
  competency: string;
  childAspect: string;
  childAspectType: string;
  parentAspect: string;
  parentAspectType: string;
}
