import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Certificate} from '../../model/certificate.model';
import {CertRequest} from '../../model/CertRequest.model';


@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  private apiUrl = 'https://localhost:8443/certificates';

  constructor(private http: HttpClient) { }

  getAllCertificates(): Observable<Certificate[]> {
    // Uklanjamo rucno dodavanje tokena jer ce interceptor to uraditi automatski
    return this.http.get<Certificate[]>(this.apiUrl);
  }

  createCertificate(request: CertRequest): Observable<Certificate> {
    // Interceptor ce automatski dodati token
    return this.http.post<Certificate>(`${this.apiUrl}/create`, request);
  }

  revokeCertificate(id: number): Observable<string> {
    // Interceptor ce automatski dodati token
    return this.http.post<string>(`${this.apiUrl}/${id}/revoke`, {});
  }

  downloadCertificate(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download-certificate`, {
      responseType: 'blob'
    });
  }

  downloadPrivateKey(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download-private-key`, {
      responseType: 'blob'
    });
  }

}
