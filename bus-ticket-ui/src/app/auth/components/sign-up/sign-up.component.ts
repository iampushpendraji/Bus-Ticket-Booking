import { NgClass } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthApiService } from "../../services/auth-api.service";
import { DataTransferService } from "../../../common/services/data-transfer.service";
import { AuthHelperService } from "../../services/auth-helper.service";

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [FormsModule, NgClass, RouterLink],
  templateUrl: "./sign-up.component.html",
  styleUrl: "./sign-up.component.css",
})
export class SignUpComponent {
  _authApiService = inject(AuthApiService);
  _authHelperService = inject(AuthHelperService);
  _dataTransferService = inject(DataTransferService);
  _router = inject(Router);

  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  
  // Submit click handler
  onSubmitSignUp(signUpForm: NgForm): void {
    console.log(signUpForm.value);
    if (signUpForm.invalid) return;

    this.isLoading.set(true);
    let userInfo = signUpForm.value;
    this._authApiService.register(userInfo).subscribe({
      next: data => {
        this.isLoading.set(false);
        if (!data.success) return this._dataTransferService.sendNotification(false, data?.message);

        this._authHelperService.setCookies(data?.data);  // Setting cookies here
        this.setDefault(signUpForm);
        this._router.navigateByUrl(`/${data?.data?.user_type.toLowerCase()}/dashboard`);
        return this._dataTransferService.sendNotification(true, "User created successfully");
      },
      error: err => {
        this.isLoading.set(false);
        if (!err.hasOwnProperty('error')) return this._dataTransferService.sendNotification(false, err?.message);
        else return this._dataTransferService.sendNotification(false, err?.error?.message);
      }
    });
  }


  // For reseting component
  setDefault(signUpForm: NgForm): void {
    this.isLoading.set(false);
    this.showPassword.set(false);
    signUpForm.reset();
  }

}
