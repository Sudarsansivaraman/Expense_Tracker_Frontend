import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // 1. Get token from localStorage
  const token = localStorage.getItem('token');

  // 2. If token exists → attach to request
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 3. Forward request
  return next(req);
};