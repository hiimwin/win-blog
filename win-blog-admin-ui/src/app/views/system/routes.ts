import { Routes } from '@angular/router';
import { AuthGuard } from '../../shared/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
  {
    path: 'users',
    loadComponent: () => import('./users/user.component').then(m => m.UserComponent),
    data: {
      title: 'Users',
      requiredPolicy: 'Permissions.Users.View'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'roles',
    loadComponent: () => import('./roles/role.component').then(m => m.RoleComponent),
    data: {
      title: 'Roles',
      requiredPolicy: 'Permissions.Roles.View'
    },
    // canActivate: [AuthGuard]
  },
  // {
  //   path: '',
  //   loadComponent: () => import('./system.component').then(m => m.SystemComponent),
  // }
];

