import {Component, NgModule} from '@angular/core';
import {InputComponent} from '../../../shared/ui/input/input.component';
import {ButtonComponent} from '../../../shared/ui/button/button.component';
import {NgClass} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
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

  constructor() { }


  onRegister() {
    if (!this.email || !this.firstname || !this.lastname || !this.organization || !this.password || !this.confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (this.passwordStrength === 'weak') {
      alert('Password is too weak.');
      return;
    }


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
