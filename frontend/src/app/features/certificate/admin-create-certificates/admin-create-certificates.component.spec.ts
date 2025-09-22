import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateCertificatesComponent } from './admin-create-certificates.component';

describe('AdminCreateCertificatesComponent', () => {
  let component: AdminCreateCertificatesComponent;
  let fixture: ComponentFixture<AdminCreateCertificatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCreateCertificatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCreateCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
