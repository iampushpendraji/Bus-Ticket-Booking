import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { VoidResult204, SignInResponse, SignInUser, VerifyForgetPasswordOtp } from '../interfaces/auth-interface';


@Injectable({
  providedIn: 'root'
})


export class AuthApiService {
  _http: HttpClient = inject(HttpClient);


  constructor() { }


  // For log in user
  signIn(SignInUser: SignInUser): Observable<SignInResponse> {
    let url = `${environment.apiUrl}/api/${environment.apiVersion}/user/sign_in`;
    return this._http.post<SignInResponse>(url, SignInUser);
  }


  // For sending otp to email
  forgetPassword(user_email: string): Observable<VoidResult204> {
    let url = `${environment.apiUrl}/api/${environment.apiVersion}/user/forget_password`;
    let params = new HttpParams().set('user_email', user_email);
    return this._http.get<VoidResult204>(url, { params });
  }


  // For verifing otp
  verifyForgetPasswordOtp(user_email: string, otp: string): Observable<VerifyForgetPasswordOtp> {
    let url = `${environment.apiUrl}/api/${environment.apiVersion}/user/verify_forget_password_otp`;
    let params = new HttpParams().set('user_email', user_email).set('otp', otp);
    return this._http.get<VerifyForgetPasswordOtp>(url, { params });
  }


  changePasswordWithSecret(obj: { user_email: string, new_password: string, forgot_pass_secret: string }): Observable<VoidResult204> {
    let url = `${environment.apiUrl}/api/${environment.apiVersion}/user/change_password_with_secret`;
    return this._http.post<VoidResult204>(url, obj);
  }

}
