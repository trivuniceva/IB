import { Component } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {

  navItems = [
    { name: 'Home', route: '/', iconUrl: 'icons/home.png' },
    { name: 'Profile', route: '/profile', iconUrl: 'icons/profile.png' },
    { name: 'Notifications', route: '/notifications', iconUrl: 'icons/bell.png' },
  ];

}
