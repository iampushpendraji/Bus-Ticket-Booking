import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthHelperService } from '../../auth/services/auth-helper.service';

export const checkUserGuard: CanMatchFn = (route, segments) => {
  const _authHelperService = inject(AuthHelperService),
    _router = inject(Router),
    userInfo = _authHelperService.getCookies('auth-bus-ticket');

  if(!userInfo) return true;   

  let userInfoParsed = JSON.parse(userInfo);
  
  _router.navigateByUrl(`${userInfoParsed.user_type.toLowerCase()}`); // If userinfo is there then redirecting user to it's route

  return false;
};
