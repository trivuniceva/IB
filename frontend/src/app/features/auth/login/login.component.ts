import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {InputComponent} from '../../../shared/ui/input/input.component';
import {ButtonComponent} from '../../../shared/ui/button/button.component';
import {AuthService} from '../../../core/service/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    RouterModule,
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Neuspešan login, proveri email i lozinku';
      }
    });
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
