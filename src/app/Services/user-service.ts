import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from '../Model/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://localhost:7255/api/auth';

  constructor(private http: HttpClient) {}

  // 🔐 Login
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // 📝 Register
  register(user: Users): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }
}