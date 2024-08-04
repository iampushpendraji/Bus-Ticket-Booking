import { Injectable, inject } from '@angular/core';
import { AuthCookie } from '../interfaces/auth-interface';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class AuthHelperService {
  _ngxCookieService: CookieService = inject(CookieService);


  constructor() { }


  // Setting cookies
  setCookies(data: AuthCookie): void {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + environment.authCookieExpiry); // Set expiration to 10 days from now
    this._ngxCookieService.set('auth-bus-ticket', JSON.stringify(data), {
      expires: expirationDate, // Set expiration date
      path: '/',               // Path where the cookie is accessible
      secure: true,            // Cookie is only sent over HTTPS
      sameSite: 'Lax'          // SameSite attribute to prevent CSRF attacks
    });
  }


  // Getting cookies
  getCookies(name: string): string {
    let cookieData = this._ngxCookieService.get(name);
    return cookieData;
  }

}
