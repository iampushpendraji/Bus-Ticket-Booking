import { NgClass } from '@angular/common';
import { Component, inject, signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthApiService } from '../../services/auth-api.service';
import { AuthHelperService } from '../../services/auth-helper.service';
import { DataTransferService } from '../../../common/services/data-transfer.service';
import { ForgotPasswordModalComponent } from '../forgot-password-modal/forgot-password-modal.component';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule, NgClass, ForgotPasswordModalComponent, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})


export class SignInComponent {
  _authApiService = inject(AuthApiService);
  _authHelperService = inject(AuthHelperService);
  _dataTransferService = inject(DataTransferService);
  _router = inject(Router);

  _forgotPasswordModalComponent = viewChild.required(ForgotPasswordModalComponent);

  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  
  constructor() { }


  // Form submit button click handler
  onSubmitSignIn(signInForm: NgForm): void {
    if (signInForm.invalid) return this._dataTransferService.sendNotification(false, "Please put all the required fields !!");
    this.signInHandler(signInForm);
  }


  // For handling signin submit button click
  signInHandler(signInForm: NgForm): void {
    this.isLoading.set(true);
    let signInUser = { user_email: signInForm.value.user_email, password: signInForm.value.password };
    this._authApiService.signIn(signInUser).subscribe({
      next: data => {
        this.isLoading.set(false);
        if (data.success !== true) return this._dataTransferService.sendNotification(false, "Error in signin");;
        this._authHelperService.setCookies(data?.data);  // Setting cookies here
        this.setDefault(signInForm);
        this._router.navigateByUrl(`/${data?.data?.user_type.toLowerCase()}/dashboard`);
        return this._dataTransferService.sendNotification(true, "Successfully signed in");
      },
      error: err => {
        this.isLoading.set(false);
        if (!err.hasOwnProperty('error')) return this._dataTransferService.sendNotification(false, err?.message);
        else return this._dataTransferService.sendNotification(false, err?.error?.message);
      }
    });
  }


  // For handling forgot password click
  forgotPasswordHandler(): void {
    this._forgotPasswordModalComponent().showModal();
  }


  // For reseting component
  setDefault(signInForm: NgForm): void {
    this.isLoading.set(false);
    this.showPassword.set(false);
    signInForm.reset();
  }

}
