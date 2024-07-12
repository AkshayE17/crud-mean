import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule ,} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormBuilder,Validators,FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Authservice } from '../../service/auth.service';
import Swal from 'sweetalert2';
import { AdminLoginResponse } from '../../models/interface';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,HttpClientModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  form: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: Authservice
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.http.post<AdminLoginResponse>('http://localhost:5000/api/adminlogin', this.form.value).subscribe({
      next: (res) => {
        this.authService.login(res.token, res.user);
        this.router.navigate(['/admindashboard']);
        Swal.fire({
          title: 'Logged in successfully',
          icon: 'success',
          position: 'top-end',
          toast: true,
          showConfirmButton: false,
          timer: 1500 
        });
        
      },
      error: (err) => {
        console.error('Login error', err);
        Swal.fire({
          icon: 'error',
          title: 'Login Error',
          text: err.error.message || 'An error occurred during login.',
        });
      }
    });
  }
}