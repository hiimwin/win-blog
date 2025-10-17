import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  FormModule,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent
} from '@coreui/angular';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequest, AdminApiAuthApiClient, AuthenticatedResult } from '../../../api/admin-api.service.generated';
import { AlertService } from '../../../shared/services/alert.service';
import { routes } from '../../content/routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, FormModule, ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  constructor (
    private fb: FormBuilder, 
    private authAPIClient: AdminApiAuthApiClient,
    private alertService: AlertService,
    private router :Router )
  {
    this.loginForm = this.fb.group({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  login()
  {
    var request: LoginRequest = new LoginRequest({
      userName: this.loginForm.controls['userName'].value,
      password: this.loginForm.controls['password'].value
    });
    this.authAPIClient.login(request).subscribe({
      next: (res: AuthenticatedResult) => {
        //Save token and refesh token to localStorage
        //Redirect to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        console.log(error);
        this.alertService.showError('Login invalid');
      }
    });
  }
}
