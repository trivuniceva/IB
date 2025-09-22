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
    { name: 'Dashboard', route: '/admin-dashboard', iconUrl: 'icons/dashboard.png' },
    { name: 'Certificates', route: '/admin/certificates', iconUrl: 'icons/certificate.png' },
    { name: 'Users', route: '/admin/users', iconUrl: 'icons/profile.png' },
    { name: 'Create Certificate', route: '/admin/create-certificate', iconUrl: 'icons/add.png' },
  ];

}
