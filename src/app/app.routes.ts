import { Routes } from '@angular/router';
import { LoginComponent } from './auth/pages/login/login.component';
import { ForgotPasswordComponent } from './auth/pages/forgot-password/forgot-password.component';
import { DashboardComponent } from './main/pages/dashboard/dashboard.component';
import { AlumnsComponent } from './main/pages/alumns/alumns.component';
import { LayoutComponent } from './main/pages/layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: '',
    component: LayoutComponent, // Layout principal que contiene el sidenav y el toolbar
    children: [
      { path: 'home', component: DashboardComponent},
      { path: 'alumns', component: AlumnsComponent},
    ]
  },

];
