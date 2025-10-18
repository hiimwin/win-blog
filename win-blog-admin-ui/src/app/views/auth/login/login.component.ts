import { Component, OnDestroy } from '@angular/core';
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
import { UrlConstants } from '../../../shared/constants/url.constants';
import { TokenStorageService } from '../../../shared/services/token-storage.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, FormModule, ReactiveFormsModule]
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  private ngUnsubscribe = new Subject<void>();
  loading = false;
  constructor (
    private fb: FormBuilder, 
    private authAPIClient: AdminApiAuthApiClient,
    private alertService: AlertService,
    private router :Router,
    private tokenService :TokenStorageService )
  {
    this.loginForm = this.fb.group({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  login()
  {
    var request: LoginRequest = new LoginRequest({
      userName: this.loginForm.controls['userName'].value,
      password: this.loginForm.controls['password'].value
    });
    this.authAPIClient.login(request)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (res: AuthenticatedResult) => {
        //Save token and refresh token to localstorage
        this.tokenService.saveToken(res.token);
        this.tokenService.saveRefreshToken(res.refreshToken);
        this.tokenService.saveUser(res);
        //Redirect to dashboard
        this.router.navigate([UrlConstants.HOME]);
      },
      error: (error: any) => {
        console.log(error);
        this.alertService.showError('Đăng nhập không đúng.');
        this.loading = false;
      },
    });
  }
}
