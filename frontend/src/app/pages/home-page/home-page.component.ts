import { Component } from '@angular/core';
import {InputComponent} from '../../shared/ui/input/input.component';
import {ButtonComponent} from '../../shared/ui/button/button.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

  constructor(private router: Router) {}

  onLogin() {
    this.router.navigate(['/login']);
  }


  onRegister() {

  }
}
