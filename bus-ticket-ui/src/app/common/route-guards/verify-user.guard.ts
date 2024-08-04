import { CanMatchFn, Router } from '@angular/router';
import { AuthHelperService } from '../../auth/services/auth-helper.service';
import { inject } from '@angular/core';

export const verifyUserGuard: CanMatchFn = (route, segments) => {
  const _authHelperService = inject(AuthHelperService),
  _router = inject(Router),
  userInfo = _authHelperService.getCookies('auth-bus-ticket');
  

  if(!userInfo) { //  If we don't have user info in cookies then we will redirect it to '/'
    _router.navigateByUrl('/');
    return false; 
  }


  let userInfoParsed = JSON.parse(userInfo);
  if(userInfoParsed.user_type.toLowerCase() == 'user') return true; //  If user_type is user then only we will allow this route


  _router.navigateByUrl('/');
  return false;
};
