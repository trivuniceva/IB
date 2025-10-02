import { Component } from '@angular/core';
import {ButtonComponent} from '../../shared/ui/button/button.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [
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
    this.router.navigate(['/signup']);
  }
}
