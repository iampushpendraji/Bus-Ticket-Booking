import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { SignInResponse, SignInUser } from '../interfaces/auth-interface';


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


}