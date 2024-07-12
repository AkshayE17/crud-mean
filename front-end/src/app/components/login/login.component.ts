import { CommonModule } from '@angular/common';
import {HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule,FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Authservice } from '../../service/auth.service.js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  form:FormGroup;
  submitted=false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: Authservice
  ){}
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  onSubmit() {
    this.submitted = true;
  
    if (this.form.invalid) {
      return;
    }
  
    this.http.post('http://localhost:5000/api/login', this.form.value).subscribe({
      next: (res: any) => {
        this.authService.login(res.token, res.user);
        this.router.navigate(['/dashboard']);
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
      }
    });
  }
}