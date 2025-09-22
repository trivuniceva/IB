import { Routes } from '@angular/router';
import {HomePageComponent} from './pages/home-page/home-page.component';
import {LoginComponent} from './features/auth/login/login.component';
import {ProfileComponent} from './features/profile/profile/profile.component';

export const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'profile', component: ProfileComponent},

  {path: '**', redirectTo: ''}
];
