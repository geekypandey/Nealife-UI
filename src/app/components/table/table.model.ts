export interface ColDef2 {
  field: string;
  header: string;
}

export enum ACTION_ICON {
  EDIT = 'edit',
  DELETE = 'delete',
  VIEW = 'view',
  ALERT = 'alert',
  DOWNLOAD = 'download',
}

export interface Action {
  icon: ACTION_ICON;
  field: string;
  onClick: Function;
}
