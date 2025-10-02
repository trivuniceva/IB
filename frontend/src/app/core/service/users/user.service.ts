import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {User} from '../../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://localhost:8443/users';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  updateUserRole(id: string, role: string) {
    return this.http.patch(`${this.apiUrl}/${id}/role`, { role });
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
