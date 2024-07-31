import { Injectable } from '@angular/core';
import { AuthCookie } from '../interfaces/auth-interface';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class AuthHelperService {

  constructor(private _ngxCookieService: CookieService) { }


  // Setting cookies
  setCookies(data: AuthCookie): void {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + environment.authCookieExpiry); // Set expiration to 10 days from now
    this._ngxCookieService.set('auth', JSON.stringify(data), {
      expires: expirationDate, // Set expiration date
      path: '/',               // Path where the cookie is accessible
      secure: true,            // Cookie is only sent over HTTPS
      sameSite: 'Lax'          // SameSite attribute to prevent CSRF attacks
    });
  }

}
