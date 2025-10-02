import { Component } from '@angular/core';
import {Router, RouterOutlet, ActivatedRoute } from '@angular/router';
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
  tokenParam: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.tokenParam = params['token'] || null;
    });
  }

  showSideNav(): boolean {
    const currentUrl = this.router.url.split('?')[0];
    return !this.hiddenRoutes.includes(currentUrl) && !this.tokenParam;
  }
}
