import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: any;
  editing = false;
  editedUser: any = {};
  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      console.log('User data from localStorage:', this.user); // Debug log
      this.editedUser = { ...this.user };
    } else {
      console.error('User data not found in localStorage');
    }
  }

  editProfile() {
    this.editing = true;
  }

  onSubmit() {
    console.log('Submitting user update:', this.editedUser); 
    if (!this.editedUser._id && this.editedUser.id) {
      this.editedUser._id = this.editedUser.id;
    }
  
    if (!this.editedUser || !this.editedUser._id) {
      console.error('User ID is missing from editedUser object');
      return;
    }
  
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
  
    const formData = new FormData();
    Object.keys(this.editedUser).forEach(key => {
      if (key !== 'photo') {
        formData.append(key, this.editedUser[key]);
      }
    });
  
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }
  
    this.http.put(`http://localhost:5000/api/update/${this.editedUser._id}`, formData, { headers })
      .subscribe({
        next: (res) => {
          Swal.fire('Success', 'User has been updated.', 'success');
          localStorage.setItem('user', JSON.stringify(res));
          this.user = { ...res };
          this.editing = false;
        },
        error: (err) => {
          console.error('Failed to update profile', err);
        }
      });
  }
  
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
    }  
  }

  cancelEdit() {
    this.editing = false;
  }
}
