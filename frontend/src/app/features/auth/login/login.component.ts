import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {InputComponent} from '../../../shared/ui/input/input.component';
import {ButtonComponent} from '../../../shared/ui/button/button.component';

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

  onLogin() {
  }

}
