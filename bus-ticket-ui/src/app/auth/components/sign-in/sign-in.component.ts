import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthApiService } from '../../services/auth-api.service';
import { AuthHelperService } from '../../services/auth-helper.service';
import { DataTransferService } from '../../../common/services/data-transfer.service';


@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})


export class SignInComponent {
  isLoading: boolean = false;
  _authApiService: AuthApiService = inject(AuthApiService);
  _authHelperService: AuthHelperService = inject(AuthHelperService);
  _dataTransferService: DataTransferService = inject(DataTransferService);


  constructor() { }


  // Form submit button click handler
  onSubmitSignIn(signInForm: NgForm): void {
    if (signInForm.invalid) return this._dataTransferService.sendNotification(false, "Please put all the required fields !!");
    this.signInHandler(signInForm);
  }


  // For handling signin submit button click
  signInHandler(signInForm: NgForm): void {
    this.isLoading = true;
    let signInUser = { user_email: signInForm.value.user_email, password: signInForm.value.password };
    this._authApiService.signIn(signInUser).subscribe({
      next: (data) => {
        if (data.success !== true) return this._dataTransferService.sendNotification(false, "Error in signin");;
        this._authHelperService.setCookies(data.data);  // Setting cookies here
        this.setDefault(signInForm);
        this._dataTransferService.sendNotification(true, "Successfully signed in")
      },
      error: (error) => {
        this.isLoading = false;
        console.log(`Error in {signIn} -->> `, error.message)
        this._dataTransferService.sendNotification(false, "Error in signin !!")
      }
    });
  }


  // For reseting component
  setDefault(signInForm: NgForm): void {
    this.isLoading = false;
    signInForm.reset();
  }

}
