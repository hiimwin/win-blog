import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions
} from '@angular/router';

import { DropdownModule, SidebarModule } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { routes } from './app.routes';
import { ADMIN_API_BASE_URL, AdminApiAuthApiClient } from '../app/api/admin-api.service.generated';
import { environment } from '../environments/environment';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AlertService } from './shared/services/alert.service';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura'
import { TokenStorageService } from './shared/services/token-storage.service';
import { TokenInterceptor } from './shared/interceptors/token.interceptor';
import { GlobalHttpInterceptorService } from './shared/interceptors/error-handler.interceptor';
import { Panel } from 'primeng/panel';
import { AdminApiRoleApiClient } from './api/admin-api.service.generated';
import { DialogService } from 'primeng/dynamicdialog';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      
      withEnabledBlockingInitialNavigation(),
      withViewTransitions(),
      withHashLocation()
    ),
    providePrimeNG({
      theme: { preset: Aura} 
    }),
    importProvidersFrom(SidebarModule, DropdownModule, ToastModule),
    IconSetService,
    provideAnimationsAsync(),
    {provide: ADMIN_API_BASE_URL, useValue: environment.API_URL},
    MessageService,
    AlertService,
    AdminApiAuthApiClient,
    [provideHttpClient()],
    TokenStorageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpInterceptorService,
      multi: true
    },
    Panel,
    AdminApiRoleApiClient,
    DialogService,
    ConfirmationService
  ]
};
