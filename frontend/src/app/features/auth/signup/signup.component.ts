import {Component, EventEmitter, Input, NgModule, Output} from '@angular/core';
import {InputComponent} from '../../../shared/ui/input/input.component';
import {ButtonComponent} from '../../../shared/ui/button/button.component';
import {NgClass, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../../core/service/auth/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    FormsModule,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  email: string = '';
  firstname: string = '';
  lastname: string = '';
  organization: string = '';
  password: string = '';
  confirmPassword: string = '';

  passwordStrength: 'weak' | 'medium' | 'strong' = 'weak';
  passwordStrengthMessage: string = '';

  message: { type: 'success' | 'error' | 'warning', text: string } | null = null;

  constructor(private authService: AuthService) { }

  showMessage(type: 'success' | 'error' | 'warning', text: string) {
    this.message = { type, text };
    setTimeout(() => this.message = null, 5000);
  }

  onRegister() {
    if (!this.email || !this.firstname || !this.lastname || !this.organization || !this.password || !this.confirmPassword) {
      this.showMessage('warning', 'Please fill in all fields.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.showMessage('warning', 'Passwords do not match.');
      return;
    }

    if (this.passwordStrength === 'weak') {
      this.showMessage('warning', 'Password is too weak. Please use a stronger password.');
      return;
    }

    this.authService.register({
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      organization: this.organization,
      password: this.password,
      confirmPassword: this.confirmPassword
    }).subscribe({
      next: () => {
        this.showMessage('success', 'Registration successful! Please check your email to activate your account before logging in.');

        // alert('Registration successful! You can now log in.');
      },
      error: (err) => {
        console.error('Registration error:', err);
        const errorMessage = err.error && err.error.message ? err.error.message : 'Registration failed. Please try again.';
        this.showMessage('error', errorMessage);
        // alert('Registration failed.');
      }
    });
  }

  checkPasswordStrength(value: string) {
    this.password = value;
    const regexStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const regexMedium = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (regexStrong.test(value)) {
      this.passwordStrength = 'strong';
      this.passwordStrengthMessage = 'Strong password';
    } else if (regexMedium.test(value)) {
      this.passwordStrength = 'medium';
      this.passwordStrengthMessage = 'Medium strength password';
    } else {
      this.passwordStrength = 'weak';
      this.passwordStrengthMessage = 'Weak password';
    }
  }


}
