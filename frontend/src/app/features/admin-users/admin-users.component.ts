import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { Observable } from 'rxjs';
import {EntityHeaderComponent} from '../../shared/ui/entity-header/entity-header.component';
import {User} from '../../core/model/user.model';
import {AuthService} from '../../core/service/auth/auth.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    EntityHeaderComponent,
  ],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {

  adminUser: User | null = null;
  users: User[] = [];

  constructor(
    private authService: AuthService,
    // private userService: UserService
  ) {}

  ngOnInit() {
    this.adminUser = this.authService.getUserInfo();
    this.loadUsers();
  }

  loadUsers() {
    // this.userService.getAllUsers().subscribe(data => {
    //   // Dummy data za testiranje
    //   if (data.length === 0) {
    //     this.users = [
    //       { uid: 'user123', firstname: 'Ana', lastname: 'Peric', email: 'ana.p@example.com', role: 'User' },
    //       { uid: 'admin456', firstname: 'Marko', lastname: 'Horvat', email: 'marko.h@example.com', role: 'Admin' },
    //       { uid: 'user789', firstname: 'Jovana', lastname: 'Markovic', email: 'jovana.m@example.com', role: 'User' },
    //     ];
    //   } else {
    //     this.users = data;
    //   }
    // });
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
}
