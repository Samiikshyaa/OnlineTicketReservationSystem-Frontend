import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    userName: ['', Validators.required],
    password: ['', Validators.required]
  });

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.http.post('http://localhost:8080/login', this.loginForm.value, { responseType: 'text' }).subscribe({
      next: (token) => {
        const decodedToken: any = jwtDecode(token);
        
        // Extract the role and store it in localStorage
        const userRole = decodedToken.role;  // Assuming role is part of the token
        localStorage.setItem('role', userRole); 
        localStorage.setItem('token', token);
        // alert('Login successful');
        if(userRole == "ROLE_ADMIN"){
        this.router.navigate(['/dashboard']);
        }else{
          this.router.navigate(['/bus-route'])
        }
      },
      error: () => {
        alert('Incorrect username or password');
      }
    });
  }
}
