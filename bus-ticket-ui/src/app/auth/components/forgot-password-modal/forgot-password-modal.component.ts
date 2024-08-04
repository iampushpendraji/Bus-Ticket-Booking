import { NgClass } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { AuthApiService } from '../../services/auth-api.service';
import { DataTransferService } from '../../../common/services/data-transfer.service';


@Component({
  selector: 'app-forgot-password-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './forgot-password-modal.component.html',
  styleUrl: './forgot-password-modal.component.css'
})


export class ForgotPasswordModalComponent implements OnInit {
  modalTitle = signal<string>("Forgot Password");
  modalFor = signal<string>("get-user-email");
  isLoading = signal<boolean>(false);
  OTPTimeOut = signal<number>(120);
  showNewPassword = signal<boolean>(false);
  showConfirmNewPassword = signal<boolean>(false);

  _authApiService = inject(AuthApiService);
  _dataTransferService = inject(DataTransferService);

  forgotPasswordForm: FormGroup;
  forgotPasswordModal: Modal | undefined;
  forgot_pass_secret: string = '';
  OTPExpireInterval: any;


  constructor() {
    let formOptions: AbstractControlOptions = {
      validators: this.passwordMatch('new_password', 'confirm_new_password')
    }

    this.forgotPasswordForm = new FormGroup({
      forgotPasswordEmail: new FormControl('', [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i)]),
      otp: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^\d+$/)]),
      new_password: new FormControl('', [Validators.required]),
      confirm_new_password: new FormControl('', [Validators.required])
    }, formOptions);
  }


  ngOnInit(): void {
    this.forgotPasswordModal = new Modal('#forgot-password-modal'); // Initializing modal element
  }


  // Showing forgot password modal
  showModal(): void {
    this.forgotPasswordModal!.show();
  }


  // Hiding forgot password modal
  hideModal(): void {
    this.modalTitle.set('Forgot Password');
    this.modalFor.set('get-user-email');
    this.forgotPasswordForm.reset();
    this.forgotPasswordModal!.hide();
    this.OTPTimeOut.set(120);
    this.OTPExpireIntervalFn(false);
    this.isLoading.set(false);
    this.showNewPassword.set(false);
    this.showConfirmNewPassword.set(false);
  }


  // Handling form submit click
  formSubmithandler(): void {
    if (this.modalFor() == "get-user-email") {
      this.handleUserEmailSubmit();
    }
    else if (this.modalFor() == "get-user-otp") {
      this.handleUserOTPSubmit();
    }
    else if (this.modalFor() == "get-user-new-password") {
      this.handleUserPasswordSubmit();
    }
  }


  // Handle user email submit click
  handleUserEmailSubmit(): void {
    if (this.forgotPasswordForm.get("forgotPasswordEmail")?.invalid) return this.forgotPasswordForm.get("forgotPasswordEmail")?.markAsTouched();

    this.isLoading.set(true);
    this.OTPTimeOut.set(120);
    this.OTPExpireIntervalFn(false);

    let user_email = this.forgotPasswordForm.value.forgotPasswordEmail;

    this._authApiService.forgetPassword(user_email).subscribe({
      next: data => {
        this.isLoading.set(false);
        if (!data) {
          this.OTPTimeOut.set(120);
          this.OTPExpireIntervalFn(true);
          return this.modalFor.set('get-user-otp');
        }
        else {
          return this._dataTransferService.sendNotification(false, data.message);
        }
      },
      error: err => {
        this.isLoading.set(false);
        if (!err.hasOwnProperty('error')) return this._dataTransferService.sendNotification(false, err?.message);
        else return this._dataTransferService.sendNotification(false, err?.error?.message);
      }
    });
  }


  // Handle user OTP submit click
  handleUserOTPSubmit(): void {
    if (this.forgotPasswordForm.get("otp")?.invalid) return this.forgotPasswordForm.get("otp")?.markAsTouched();

    this.isLoading.set(true);

    let user_email = this.forgotPasswordForm.value.forgotPasswordEmail, otp = this.forgotPasswordForm.value.otp;

    this._authApiService.verifyForgetPasswordOtp(user_email, otp).subscribe({
      next: data => {
        this.isLoading.set(false);
        if (data.success) {
          this.forgot_pass_secret = data.data.forgot_pass_secret;
          return this.modalFor.set('get-user-new-password');
        }
        else {
          return this._dataTransferService.sendNotification(false, data.message);
        }
      },
      error: err => {
        this.isLoading.set(false);
        if (!err.hasOwnProperty('error')) return this._dataTransferService.sendNotification(false, err?.message);
        else return this._dataTransferService.sendNotification(false, err?.error?.message);
      }
    });
  }


  // Handle user password submit click
  handleUserPasswordSubmit(): void {
    if (( this.forgotPasswordForm.get("new_password")?.invalid || this.forgotPasswordForm.get("confirm_new_password")?.invalid ) || ( this.forgotPasswordForm.hasError("passwordMatch") || !this.forgot_pass_secret )) { 
      this.forgotPasswordForm.get("new_password")?.markAsTouched(); 
      this.forgotPasswordForm.get("confirm_new_password")?.markAsTouched(); 
      return;
    }
    
    let obj = {
      user_email: this.forgotPasswordForm.value.forgotPasswordEmail,
      new_password: this.forgotPasswordForm.value.new_password,
      forgot_pass_secret: this.forgot_pass_secret
    }

    this._authApiService.changePasswordWithSecret(obj).subscribe({
      next: data => {
        this.isLoading.set(false);
        if (!data) {
          this._dataTransferService.sendNotification(true, "Password updated successfully !!");
          return this.hideModal();
        }
        else {
          return this._dataTransferService.sendNotification(false, data.message);
        }
      },
      error: err => {
        this.isLoading.set(false);
        if (!err.hasOwnProperty('error')) return this._dataTransferService.sendNotification(false, err?.message);
        else return this._dataTransferService.sendNotification(false, err?.error?.message);
      }
    });

  }


  // For starting timer for otp expiration
  OTPExpireIntervalFn(status: boolean): void {
    if(status) {
      this.OTPExpireInterval = setInterval(() => {
        if(this.OTPTimeOut() == 0) return clearInterval(this.OTPExpireInterval);
        this.OTPTimeOut.update((value) => value - 1);
      }, 1000);
    }
    else {
      if(this.OTPExpireInterval) return clearInterval(this.OTPExpireInterval);
    }
  }


  // Getting form control of {forgotPasswordForm}
  getFormControl(formControlName: string): AbstractControl | null {
    return this.forgotPasswordForm.get(formControlName);
  }


  // For validation new password and confirm new password is same or not
  passwordMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const form = formGroup as FormGroup; // Type assertion
      const control = form.get(controlName);
      const matchingControl = form.get(matchingControlName);

      if (!control || !matchingControl) {
        return null; // If controls are not found, no validation errors
      }

      if (control.value !== matchingControl.value) {

        return { passwordMatch: true };
      }

      return null;
    };
  }


}