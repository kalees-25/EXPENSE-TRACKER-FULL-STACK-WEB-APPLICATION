import { CanActivateFn, Router } from '@angular/router';

import { inject } from '@angular/core';

import { AuthService } from '../../features/components/features/auth/auth.service';

export const guestGuard: CanActivateFn = (route,state) => {
  // -----------------------------------
  // SERVICES
  // -----------------------------------

  const authService = inject(AuthService);

  const router = inject(Router);

  // -----------------------------------
  // AUTH CHECK
  // -----------------------------------

  const isAuthenticated = authService.isLoggedIn();

  // -----------------------------------
  // ALREADY LOGGED IN
  // -----------------------------------

  if (isAuthenticated) {
    return router.createUrlTree(['/dashboard']);
  }

  // -----------------------------------
  // ALLOW GUEST USER
  // -----------------------------------

  return true;
};
