import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { inject } from '@angular/core';

import { AuthService } from '../../features/components/features/auth/auth.service';


export const authGuard: CanActivateFn = (route:ActivatedRouteSnapshot ,state:RouterStateSnapshot) => {
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
  // USER AUTHORIZED
  // -----------------------------------

  if (isAuthenticated) {
    return true;
  }

  // ------------------------------------------------------------------
  // REDIRECT TO LOGIN
  // ----------------------------------------------------------------

  return router.createUrlTree(
    ['/login'],

    {
      queryParams: {
        returnUrl: state.url,
      },
    },
  );
};
