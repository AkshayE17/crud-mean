import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  selectedFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      photo: [null, Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value
      ? null : { mismatch: true };
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.valid && this.selectedFile) {
      const formData = new FormData();
      Object.keys(this.form.value).forEach(key => {
        if (key !== 'photo') {
          formData.append(key, this.form.value[key]);
        }
      });
      formData.append('photo', this.selectedFile, this.selectedFile.name);

      this.http.post("http://localhost:5000/api/register", formData).subscribe(
        () => {
          Swal.fire("Success", "Registration successful!", "success")
            .then(() => this.router.navigate(['/login']));
        },
        (err) => {
          Swal.fire("Error", err.error.message, "error");
        }
      );
    } else {
      Swal.fire("Error", "Please fill out all fields correctly and upload a photo.", "error");
    }
  }
}