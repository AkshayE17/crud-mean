import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient ,HttpErrorResponse,HttpHeaders} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { User } from '../../models/interface';
import { Authservice } from '../../service/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule, HttpClientModule, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  searchTerm: string = '';
  users: User[] = [];
  editingUser: User | null = null;
  editedUser: Partial<User> = {};
  showAddUser: boolean = false;
  addUserForm: FormGroup;
  selectedFile: File | null = null;
  submitted: boolean = false;

  constructor(private http: HttpClient, private formBuilder: FormBuilder,private authService:Authservice) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.addUserForm = this.formBuilder.group({
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

  fetchUsers(): void {
    this.http.get<User[]>('http://localhost:5000/api/users')
      .subscribe((response: User[]) => {
        this.users = response;
        console.log("users from front-end", response);
      }, (error: any) => {
        console.error('Error fetching users:', error);
      });
  }

  searchUsers(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}` 
    });
  
    this.http.get<{ users: User[] }>(`http://localhost:5000/api/search?search=${encodeURIComponent(this.searchTerm)}`, { headers })
      .subscribe(
        (response) => {
          this.users = response.users;
        },
        (error) => {
          console.error('Error searching users:', error);
        }
      );
  }

  addNewUser(): void {
    this.toggleAddUser();
  }

  toggleAddUser(): void {
    this.showAddUser = !this.showAddUser;
    if (this.showAddUser) {
      this.addUserForm.reset();
      this.selectedFile = null;
      this.submitted = false;
    }
  }

  editUser(user: User): void {
    this.editingUser = user;
    this.editedUser = { ...user };
    this.selectedFile = null; // Reset selectedFile when starting to edit another user
  }

  saveChanges(): void {
    const authToken = this.authService.getToken(); 
      
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    
    const formData = new FormData();
    Object.keys(this.editedUser).forEach(key => {
    const value = (this.editedUser as any)[key];
      if (key !== 'photo') {
        formData.append(key, value);
      }
    });
  
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }
  
    this.http.put(`http://localhost:5000/api/update/${this.editedUser._id}`, formData, { headers })
     .subscribe({
        next: (res) => {
            Swal.fire("Success", "Updated successfully!", "success");
            console.log('Profile updated successfully', res);
            this.fetchUsers();
            this.editingUser = null;
        },
        error: (err) => {
          console.error('Failed to update profile', err);
        }
      });
  }
  

  
  cancelEdit(): void {
    this.editingUser = null;
  }

  deleteUser(userId: string): void {
    // Display confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:5000/api/users/${userId}`)
          .subscribe(
            () => {
              Swal.fire('Deleted!', 'User has been deleted.', 'success');
              this.fetchUsers(); 
            },
            (error: HttpErrorResponse) => {
              console.error(`Error deleting user with ID ${userId}:`, error);
              Swal.fire('Error', 'Failed to delete user.', 'error');
            }
          );
      }
    });
  }
  
  onFileSelected(event: any): void {
    const file = event.target.files[0] as File;
    this.addUserForm.patchValue({
      photo: file
    });
    this.addUserForm.get('photo')?.updateValueAndValidity();
  }

  

  addUser(): void {
    this.submitted = true;
    if (this.addUserForm.valid && this.addUserForm.get('photo')?.value) {

      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });
      
      
      const formData = new FormData();
      Object.keys(this.addUserForm.value).forEach(key => {
        if (key !== 'photo') {
          formData.append(key, this.addUserForm.value[key]);
        }
      });
      formData.append('photo', this.addUserForm.get('photo')!.value, this.addUserForm.get('photo')!.value.name);
  
      this.http.post('http://localhost:5000/api/register', formData,{headers})
        .subscribe({
          next: (res) => {
            Swal.fire("Success", "New user added successfully!", "success");
            this.fetchUsers();
            this.toggleAddUser();
          },
          error: (err) => {
            console.error('Failed to add user', err);
          }
        });
    } else {
      console.error('Form is invalid or no file selected');
    }
  }
}
