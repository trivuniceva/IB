import { Routes } from '@angular/router';
import {HomePageComponent} from './pages/home-page/home-page.component';
import {LoginComponent} from './features/auth/login/login.component';
import {ProfileComponent} from './features/profile/profile/profile.component';
import {AdminCertificatesComponent} from './features/certificate/admin-certificates/admin-certificates.component';
import {
  AdminCreateCertificatesComponent
} from './features/certificate/admin-create-certificates/admin-create-certificates.component';
import {AdminUsersComponent} from './features/admin-users/admin-users.component';
import {AdminDashboardComponent} from './features/admin-dashboard/admin-dashboard.component';
import {SignupComponent} from './features/auth/signup/signup.component';

export const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'profile', component: ProfileComponent},

  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'admin/certificates', component: AdminCertificatesComponent },
  { path: 'admin/users', component: AdminUsersComponent },
  { path: 'admin/create-certificate', component: AdminCreateCertificatesComponent },


  {path: '**', redirectTo: ''}
];
