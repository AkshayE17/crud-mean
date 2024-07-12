import { Component, OnInit } from '@angular/core';
import { Authservice } from '../../service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit{
  isLoggedIn = false;
  constructor(private authService: Authservice, private router: Router) {}

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });
  }
  
  isAdmin(): boolean {
    return this.authService.isAdmin(); 
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
    Swal.fire({
      title: 'Logged out successfully',
      icon: 'error',
      position: 'top-end',
      toast: true,
      showConfirmButton: false,
      timer: 1500 
    });
    
  }
}