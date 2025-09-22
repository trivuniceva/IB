import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {EntityHeaderComponent} from '../../../shared/ui/entity-header/entity-header.component';
import {User} from '../../../core/model/user.model';
import {Certificate} from '../../../core/model/certificate.model';
import {AuthService} from '../../../core/service/auth/auth.service';
import {CertificateService} from '../../../core/service/certificate/certificate.service';

@Component({
  selector: 'app-admin-create-certificate',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    ReactiveFormsModule,
    EntityHeaderComponent,
  ],
  templateUrl: './admin-create-certificates.component.html',
  styleUrls: ['./admin-create-certificates.component.scss']
})
export class AdminCreateCertificatesComponent implements OnInit {
  user: User | null = null;
  certificateForm: FormGroup;
  issuerCertificates: Certificate[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private certificateService: CertificateService,
    private router: Router
  ) {
    this.certificateForm = this.fb.group({
      type: ['End-Entity', Validators.required],
      issuerId: [null],
      commonName: ['', Validators.required],
      organization: ['', Validators.required],
      organizationalUnit: ['', Validators.required],
      country: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      validityDays: [365, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.user = this.authService.getUserInfo();
    this.loadIssuerCertificates();

    this.certificateForm.get('type')?.valueChanges.subscribe(type => {
      this.toggleIssuerField(type);
    });
  }

  toggleIssuerField(type: string) {
    const issuerIdControl = this.certificateForm.get('issuerId');
    console.log(type)
    if (type === 'Root') {
      issuerIdControl?.clearValidators();
      issuerIdControl?.disable();
    } else {
      issuerIdControl?.setValidators(Validators.required);
      issuerIdControl?.enable();
    }
    issuerIdControl?.updateValueAndValidity();
  }

  loadIssuerCertificates() {
    this.certificateService.getAllCertificates().subscribe(data => {
      this.issuerCertificates = data.filter(cert => cert.type !== 'End-Entity' && !cert.revoked);
      // da li postoji neki sertifikat za izdavanje
      console.log(this.issuerCertificates);
      console.log("this.issuerCertificates");
      if (this.issuerCertificates.length > 0) {
        this.certificateForm.get('issuerId')?.setValue(this.issuerCertificates[0].id);
      } else {
        // ako nema CA sertifikata, onemoquci kreiranje svih osim Root-a
        if (this.certificateForm.get('type')?.value !== 'Root') {
          this.certificateForm.get('issuerId')?.disable();
          this.certificateForm.get('type')?.setValue('Root');
        }
      }
    });
  }

  createCertificate() {
    if (this.certificateForm.valid) {
      // pretvori tip u velika slova pre slanja backend-u
      const formValue = { ...this.certificateForm.value };
      formValue.type = formValue.type.toUpperCase();  // ROOT, INTERMEDIATE, END_ENTITY

      // ako je tip End-Entity, proveriti da li je izabran izdavalac
      if (formValue.type !== 'ROOT' && !formValue.issuerId) {
        console.error('Nije odabran izdavalac sertifikata.');
        return;
      }

      this.certificateService.createCertificate(formValue).subscribe(
        () => {
          console.log('Sertifikat je uspesno kreiran!');
          this.router.navigate(['/admin/certificates']);
        },
        error => {
          console.error('Neuspesno kreiranje sertifikata:', error.message);
        }
      );
    } else {
      console.log('Molimo popunite sva obavezna polja.');
    }
  }

}
