import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
    { path: 'sign-in', loadComponent: () => import('./auth/components/sign-in/sign-in.component').then(p => p.SignInComponent) },
    { path: 'sign-up', loadComponent: () => import('./auth/components/sign-up/sign-up.component').then(p => p.SignUpComponent) },
];