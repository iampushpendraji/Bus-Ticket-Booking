import { Routes } from '@angular/router';
import { checkUserGuard } from './common/route-guards/check-user.guard';
import { verifyUserGuard } from './common/route-guards/verify-user.guard';
import { verifyAdminGuard } from './common/route-guards/verify-admin.guard';

export const routes: Routes = [

    //  Unprotected Routes Start
    {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'full'
    },
    {
        path: 'sign-in',
        loadComponent: () => import('./auth/components/sign-in/sign-in.component').then(p => p.SignInComponent),
        canMatch: [checkUserGuard]
    },
    {
        path: 'sign-up',
        loadComponent: () => import('./auth/components/sign-up/sign-up.component').then(p => p.SignUpComponent),
        canMatch: [checkUserGuard]
    },
    //  Unprotected Routes End


    //  Admin Routes
    {
        path: 'admin',
        canMatch: [verifyAdminGuard],
        loadComponent: () => import('./admin/components/admin-wrapper/admin-wrapper.component').then(p => p.AdminWrapperComponent),
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./admin/components/admin-dashboard-main/admin-dashboard-main.component').then(p => p.AdminDashboardMainComponent)
            }
        ]
    },


    //  User Routes
    {
        path: 'user',
        canMatch: [verifyUserGuard],
        loadComponent: () => import('./user/components/user-wrapper/user-wrapper.component').then(p => p.UserWrapperComponent),
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./user/components/admin-dashboard-main/user-dashboard-main.component').then(p => p.UserDashboardMainComponent)
            }
        ]
    },


    // Wild card route
    {
        path: '**',
        loadComponent: () => import('./common/components/wild-card/wild-card.component').then(p => p.WildCardComponent)
    }
];