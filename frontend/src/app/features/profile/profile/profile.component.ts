import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf} from '@angular/common';
import { AuthService } from '../../../core/service/auth/auth.service';
import { User } from '../../../core/model/user.model';
import { Certificate } from '../../../core/model/certificate.model';
import { EntityHeaderComponent } from '../../../shared/ui/entity-header/entity-header.component';
import { TabsComponent } from '../../../shared/ui/tabs/tabs.component';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import {CertificateService} from '../../../core/service/certificate/certificate.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    EntityHeaderComponent,
    TabsComponent,
    EditProfileComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  showEditPopup = false;


  activeTab = 'Certificates Overview';
  tabs = ['Certificates Overview', 'Users Overview', 'Quick Actions'];

  myCertificates: Certificate[] = [];
  revokedCertificates: Certificate[] = [];
  certificateRequests: any[] = [];
  hideSidebar = false;

  constructor(
    private authService: AuthService,
    private certificateService: CertificateService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUserInfo();
  }

  onTabChange(tab: string) {
    this.activeTab = tab;
    this.hideSidebar = tab === 'Users Overview' || tab === 'Quick Actions';
  }

  closeEditPopup() {
    this.showEditPopup = false;
  }

  openEditPopup() {
    this.showEditPopup = true;
  }

}
