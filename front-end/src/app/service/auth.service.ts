import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Authservice {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor() {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token'); 
  }
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  login(token: string, user:any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.loggedIn.next(true);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.loggedIn.next(false);
  }

  isAdmin(): boolean {
    const userData = localStorage.getItem('user');
    if (userData) {
      console.log("user:",userData)
      const user = JSON.parse(userData);
      return user.isAdmin==1;
    }
    return false;
  }
}