import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import {EntityHeaderComponent} from '../../shared/ui/entity-header/entity-header.component';
import {User} from '../../core/model/user.model';
import {AuthService} from '../../core/service/auth/auth.service';
import {CertificateService} from '../../core/service/certificate/certificate.service';
import {UserService} from '../../core/service/users/user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    EntityHeaderComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  adminUser: User | null = null;
  totalCertificates: number = 0;
  totalActiveCertificates: number = 0;
  totalUsers: number = 0;

  constructor(
    private authService: AuthService,
    private certificateService: CertificateService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.adminUser = this.authService.getUserInfo();
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.certificateService.getAllCertificates().subscribe(certs => {
      this.totalCertificates = certs.length;
      this.totalActiveCertificates = certs.filter(c => !c.revoked).length;
    });

    this.userService.getAllUsers().subscribe(users => {
      this.totalUsers = users.length;
    });
  }
}
