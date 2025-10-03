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

  X509_REVOCATION_REASONS: { [key: number]: string } = {
    1: "1: KEY_COMPROMISE (Kompromitovan ključ)",
    2: "2: CA_COMPROMISE (Kompromitovan CA)",
    3: "3: AFFILIATION_CHANGED (Promena pripadnosti/statusa)",
    4: "4: SUPERSEDED (Zamenjen novim sertifikatom)",
    5: "5: CESSATION_OF_OPERATION (Prestanak rada subjekta)",
    6: "6: CERTIFICATE_HOLD (Sertifikat privremeno na čekanju)",
    0: "0: UNSPECIFIED (Nespecificiran)",
  };

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
      this.allCertificates = data;
      this.filterCertificates();
    }, error => {
      console.error('neuspesno ucitavanje sertifikata', error);
      // dummy data samo za demonstraciju u slucaju greske :") <3
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

  downloadFile(data: Blob, filename: string) {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // downloadCertificate(id: number, commonName: string) {
  //   this.certificateService.downloadCertificate(id).subscribe(
  //     (data) => {
  //       this.downloadFile(data, `${commonName}.cer`);
  //     },
  //     (error) => {
  //       console.error('Neuspešno preuzimanje sertifikata', error);
  //       alert('Neuspešno preuzimanje sertifikata!');
  //     }
  //   );
  // }

  // downloadPrivateKey(id: number, commonName: string) {
  //   this.certificateService.downloadPrivateKey(id).subscribe(
  //     (data) => {
  //       this.downloadFile(data, `${commonName}.key`);
  //     },
  //     (error) => {
  //       console.error('Neuspesno preuzimanje privatnog kljusa', error);
  //       alert('Neuspesno preuzimanje privatnog kljusa!');
  //     }
  //   );
  // }

  downloadKeystore(id: number, commonName: string) {
    const password = prompt('Unesite lozinku za zaštitu PKCS#12 (P12) fajla:');

    if (password === null || password.trim() === '') {
      alert('Preuzimanje je otkazano. Lozinka je obavezna.');
      return;
    }

    this.certificateService.downloadKeystore(id, password).subscribe(
      (data) => {
        // Postavljamo .p12 ekstenziju
        this.downloadFile(data, `${commonName}.p12`);
        alert('PKCS#12 (P12) fajl uspešno preuzet!');
      },
      (error) => {
        console.error('Neuspešno preuzimanje Keystore-a', error);
        alert('Neuspešno preuzimanje Keystore-a! Proverite da li je lozinka validna i da je sertifikat validan.');
      }
    );
  }

  validateCertificate(id: number) {
    this.certificateService.isCertificateValid(id).subscribe(isValid => {
      if (isValid) {
        alert('Sertifikat je validan!');
      } else {
        alert('Sertifikat nije validan. Proverite status, datum isteka ili lanac poverenja.');
      }
    }, error => {
      console.error('Neuspesna validacija sertifikata', error);
      alert('Doslo je do greske prilikom validacije sertifikata.');
    });
  }

  downloadCrl(caId: number) {
    this.certificateService.downloadCrl(caId).subscribe(
      (data) => {
        this.downloadFile(data, `crl-${caId}.crl`);
        alert('CRL uspesno preuzet!');
      },
      (error) => {
        console.error('Neuspesno preuzimanje CRL-a', error);
        alert('Greska pri preuzimanju CRL-a.');
      }
    );
  }

  revokeCertificate(id: number) {
    const reasonOptions = Object.values(this.X509_REVOCATION_REASONS).join('\n');

    // Koristimo prompt za unos koda razloga
    const reasonInput = prompt(
      "Unesite X.509 kod razloga za opoziv:\n" +
      "----------------------------------\n" +
      reasonOptions
    );

    if (reasonInput === null || reasonInput.trim() === '') {
      alert('Opoziv otkazan. Razlog je obavezan.');
      return;
    }

    const reasonCode = parseInt(reasonInput.trim());

    // Provera da li je uneti kod validan
    if (isNaN(reasonCode) || !this.X509_REVOCATION_REASONS.hasOwnProperty(reasonCode)) {
      alert('Nevažeći kod razloga opoziva. Molimo unesite kod sa liste (0-6).');
      return;
    }

    // Poziv servisa sa ID-jem i KODOM RAZLOGA
    this.certificateService.revokeCertificate(id, reasonCode).subscribe(() => {
      alert('Sertifikat je opozvan!');
      this.loadAllCertificates();
    }, error => {
      console.error('Neuspesno opozivanje sertifikata', error);
    });
  }
}
