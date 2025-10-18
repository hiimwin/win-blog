import { Routes } from '@angular/router';
import { AuthGuard } from '../../shared/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent),
    data: {
      title: $localize`Dashboard`,
      requiredPolicy: 'Permissions.Dashboard.View'
    },
  }
];

