import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { AuthService } from '../../../core/service/auth/auth.service';
import { User } from '../../../core/model/user.model';
import { Certificate } from '../../../core/model/certificate.model';
import { EntityHeaderComponent } from '../../../shared/ui/entity-header/entity-header.component';
import { TabsComponent } from '../../../shared/ui/tabs/tabs.component';
import { CertificateService } from '../../../core/service/certificate/certificate.service';

@Component({
  selector: 'app-admin-certificates',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    EntityHeaderComponent,
    TabsComponent,
  ],
  templateUrl: './admin-certificates.component.html',
  styleUrls: ['./admin-certificates.component.scss']
})
export class AdminCertificatesComponent implements OnInit {

  user: User | null = null;
  activeTab = 'All Certificates';
  tabs = ['All Certificates', 'Active Certificates', 'Revoked Certificates'];

  allCertificates: Certificate[] = [];
  filteredCertificates: Certificate[] = [];

  constructor(
    private authService: AuthService,
    private certificateService: CertificateService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUserInfo();
    this.loadAllCertificates();
  }

  onTabChange(tab: string) {
    this.activeTab = tab;
    this.filterCertificates();
  }

  loadAllCertificates() {
    this.certificateService.getAllCertificates().subscribe(data => {
      // Dummy data za testiranje
      if (data.length === 0) {
        this.allCertificates = [
          {
            id: 1,
            type: 'Root',
            commonName: 'My Root CA',
            startDate: '2025-01-01',
            endDate: '2035-01-01',
            organization: 'FTN SIIT',
            organizationalUnit: 'PKI',
            country: 'RS',
            email: 'admin@ftn.com',
            revoked: false
          },
          {
            id: 2,
            type: 'Intermediate',
            commonName: 'FTN Web Server CA',
            startDate: '2025-02-15',
            endDate: '2030-02-15',
            organization: 'FTN',
            organizationalUnit: 'IT',
            country: 'RS',
            email: 'ca@ftn.com',
            revoked: false
          },
          {
            id: 3,
            type: 'End-Entity',
            commonName: 'localhost',
            startDate: '2025-03-20',
            endDate: '2026-03-20',
            organization: 'User Org',
            organizationalUnit: 'Web',
            country: 'RS',
            email: 'user1@example.com',
            revoked: false
          },
          {
            id: 4,
            type: 'End-Entity',
            commonName: 'old-service',
            startDate: '2024-05-10',
            endDate: '2025-05-10',
            organization: 'Old Services',
            organizationalUnit: 'Archived',
            country: 'RS',
            email: 'olduser@example.com',
            revoked: true
          }
        ];
      } else {
        this.allCertificates = data;
      }
      this.filterCertificates();
    }, error => {
      console.error('neuspesno ucitavanje sertifikata', error);
      this.allCertificates = [
        {
          id: 1,
          type: 'Root',
          commonName: 'My Root CA',
          startDate: '2025-01-01',
          endDate: '2035-01-01',
          organization: 'FTN SIIT',
          organizationalUnit: 'PKI',
          country: 'RS',
          email: 'admin@ftn.com',
          revoked: false
        },
        {
          id: 2,
          type: 'Intermediate',
          commonName: 'FTN Web Server CA',
          startDate: '2025-02-15',
          endDate: '2030-02-15',
          organization: 'FTN',
          organizationalUnit: 'IT',
          country: 'RS',
          email: 'ca@ftn.com',
          revoked: false
        },
        {
          id: 3,
          type: 'End-Entity',
          commonName: 'localhost',
          startDate: '2025-03-20',
          endDate: '2026-03-20',
          organization: 'User Org',
          organizationalUnit: 'Web',
          country: 'RS',
          email: 'user1@example.com',
          revoked: false
        },
        {
          id: 4,
          type: 'End-Entity',
          commonName: 'old-service',
          startDate: '2024-05-10',
          endDate: '2025-05-10',
          organization: 'Old Services',
          organizationalUnit: 'Archived',
          country: 'RS',
          email: 'olduser@example.com',
          revoked: true
        }
      ];
      this.filterCertificates();
    });
  }

  filterCertificates() {
    if (this.activeTab === 'All Certificates') {
      this.filteredCertificates = this.allCertificates;
    } else if (this.activeTab === 'Active Certificates') {
      this.filteredCertificates = this.allCertificates.filter(c => !c.revoked);
    } else {
      this.filteredCertificates = this.allCertificates.filter(c => c.revoked);
    }
  }

  downloadCertificate(id: number) {
    // this.certificateService.downloadCertificate(id).subscribe(() => {
    //   alert('Sertifikat je uspešno preuzet!');
    // }, error => {
    //   console.error('Neuspešno preuzimanje sertifikata', error);
    // });
  }

  revokeCertificate(id: number) {
    this.certificateService.revokeCertificate(id).subscribe(() => {
      alert('Sertifikat je opozvan!');
      this.loadAllCertificates();
    }, error => {
      console.error('Neuspesno opozivanje sertifikata', error);
    });
  }
}
