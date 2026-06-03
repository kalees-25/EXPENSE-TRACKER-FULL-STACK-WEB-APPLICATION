import { inject } from '@angular/core';

import { HttpInterceptorFn } from '@angular/common/http';

import { AuthService } from '../../features/components/features/auth/auth.service';

import { environment } from '../../../environments/environment';

const PUBLIC_ROUTES = ['/auth/login', '/auth/register'];

export const authInterceptor: HttpInterceptorFn = (
  req,

  next,
) => {
  const authService = inject(AuthService);

  const isApiRequest = req.url.startsWith(environment.apiBaseUrl);

  if (!isApiRequest) {
    return next(req);
  }

  const isPublicRoute = PUBLIC_ROUTES.some((route) => req.url.includes(route));

  if (isPublicRoute) {
    return next(req);
  }

  const token = authService.getToken();

  //  TO CHECK THE IF THE TOKEN IS VALID
  if (!token?.trim()) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
