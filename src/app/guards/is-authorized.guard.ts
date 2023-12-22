import { CanActivateFn } from '@angular/router';

export const isAuthorizedGuard: CanActivateFn = (route, state) => {
  const { role } = route.data;
  return true;
};
