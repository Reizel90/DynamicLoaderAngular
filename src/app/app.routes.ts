import { Routes } from '@angular/router';
import { ConfigAccessGuard } from './config-access.guard';

export const routes: Routes = [
  {
    path: 'config',
    loadComponent: () => import('./builder/builder.component').then(m => m.BuilderComponent),
    canActivate: [ConfigAccessGuard],
  },
  {
    path: 'view',
    loadComponent: () => import('./view/view.component').then(m => m.ViewComponent),
    canActivate: [ConfigAccessGuard],
  },
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'view',
  },
];
