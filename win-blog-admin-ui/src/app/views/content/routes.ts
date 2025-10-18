import { Routes } from '@angular/router';
import { AuthGuard } from '../../shared/auth.guard';
import { Title } from 'chart.js';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'posts',
    pathMatch: 'full',
  },
  {
    path: 'posts',
    loadComponent: () => import('./posts/post.component').then(m => m.PostComponent),
    data: {
      title: 'Posts',
      requiredPolicy: 'Permissions.Posts.View'
    },
    canActivate: [AuthGuard]
  }
  // {
  //   path: '',
  //   loadComponent: () => import('./content.component').then(m => m.ContentComponent),
  // }
];

