import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'posts',
    pathMatch: 'full'
  },
  {
    path: 'posts',
    loadComponent: () => import('./posts/post.component').then(m => m.PostComponent),
    data: {
      title: 'Posts',
    }
  }
  // {
  //   path: '',
  //   loadComponent: () => import('./content.component').then(m => m.ContentComponent),
  // }
];

