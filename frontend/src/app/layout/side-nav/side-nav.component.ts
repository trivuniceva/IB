import {Component, OnInit} from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {RouterModule} from '@angular/router';
import {User} from '../../core/model/user.model';

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
export class SideNavComponent implements OnInit{

  navItems: { name: string; route: string; iconUrl: string }[] = [];
  user: User | null = null;

  ngOnInit(): void {
    const userJson = localStorage.getItem('user');
    this.user = userJson ? JSON.parse(userJson) : null;

    if (this.user?.role === 'ADMIN') {
      this.navItems = [
        { name: 'Profile', route: '/profile', iconUrl: 'icons/profile.png' },
        { name: 'Dashboard', route: '/admin-dashboard', iconUrl: 'icons/dashboard.png' },
        { name: 'Certificates', route: '/admin/certificates', iconUrl: 'icons/certificate.png' },
        { name: 'Users', route: '/admin/users', iconUrl: 'icons/users.png' },
        { name: 'Create Certificate', route: '/admin/create-certificate', iconUrl: 'icons/add.png' },
      ];
    } else if (this.user?.role === 'REGULAR_USER') {
      this.navItems = [
        { name: 'Profile', route: '/profile', iconUrl: 'icons/profile.png' }
      ];
    } else if (this.user?.role === 'CA_USER') {
      this.navItems = [
        { name: 'Profile', route: '/profile', iconUrl: 'icons/profile.png' },
        { name: 'Certificates', route: '/ca/certificates', iconUrl: 'icons/certificate.png' }
      ];
    }
  }
}
