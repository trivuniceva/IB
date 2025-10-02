import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {SideNavComponent} from './layout/side-nav/side-nav.component';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    RouterOutlet,
    SideNavComponent,

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';

  hiddenRoutes = ['/', '/login', '/signup'];

  constructor(private router: Router) {}

  showSideNav(): boolean {
    return !this.hiddenRoutes.includes(this.router.url);
  }
}
