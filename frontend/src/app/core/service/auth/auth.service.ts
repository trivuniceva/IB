import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';
import {User} from '../../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:8443/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify({
          email: response.email,
          firstname: response.firstname,
          lastname: response.lastname,
          role: response.role
        }));
      })
    );
  }

  getUserInfo(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  refreshToken(refreshToken: string) {
    return this.http.post<any>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap(tokens => {
        localStorage.setItem('accessToken', tokens.accessToken);
      })
    );
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  register(user: {
    email: string;
    firstname: string;
    lastname: string;
    organization: string;
    password: string;
    confirmPassword: string;
  }) {
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }

}
