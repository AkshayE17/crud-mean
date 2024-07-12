// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserResponse } from '../models/interface'; // Adjust the path if needed

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/api/users'; // Adjust URL as per your backend

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}`);
  }

  addUser(formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, formData);
  }

  updateUser(userId: string, formData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userId}`, formData);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${userId}`);
  }
}
