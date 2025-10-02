import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { Observable } from 'rxjs';
import {EntityHeaderComponent} from '../../shared/ui/entity-header/entity-header.component';
import {User} from '../../core/model/user.model';
import {AuthService} from '../../core/service/auth/auth.service';
import {UserService} from '../../core/service/users/user.service';
import {TabsComponent} from '../../shared/ui/tabs/tabs.component';
import {FormsModule} from '@angular/forms';
import {SignupComponent} from '../auth/signup/signup.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    CommonModule,
    FormsModule,
    TabsComponent,
    EntityHeaderComponent,
  ],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {

  adminUser: User | null = null;
  users: User[] = [];

  hideSidebar = false;
  activeTab = 'All Users';
  tabs = ['All Users', 'Add CA user'];


  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.adminUser = this.authService.getUserInfo();
    this.loadUsers();
  }

  onTabChange(tab: string) {
    this.activeTab = tab;
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }

  changeUserRole(id: string, currentRole: string) {
    // const newRole = currentRole === 'Admin' ? 'User' : 'Admin';
    // if (confirm(`Da li ste sigurni da želite da promenite ulogu korisnika ${uid} u ${newRole}?`)) {
    //   this.userService.updateUserRole(uid, newRole).subscribe(() => {
    //     alert('Uloga uspešno promenjena!');
    //     this.loadUsers();
    //   });
    // }
  }

  deleteUser() {
    // if (confirm(`Da li ste sigurni da želite da obrišete korisnika ${uid}?`)) {
    //   this.userService.deleteUser(uid).subscribe(() => {
    //     alert('Korisnik uspešno obrisan!');
    //     this.loadUsers();
    //   });
    // }
  }

  addCAUser() {

  }

  onUserAdded() {
    this.loadUsers();
    this.activeTab = 'All Users';
  }

}
