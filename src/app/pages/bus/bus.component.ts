import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bus',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './bus.component.html',
  styleUrl: './bus.component.css'
})
export class BusComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);


  seats : any[] =[]
  busForm: FormGroup = this.fb.group({
    busNumber: ['', [Validators.required, Validators.minLength(7)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    id: ['passenger', Validators.required]
  });

  get f(): { [key: string]: any } {
    return this.busForm.controls;
  }

  fetchRouteDetails() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http
      .get<{ result: any[] }>(`http://localhost:8080/api/routes/list`, {
        headers,
      })
      .subscribe((response) => {
        this.seats = response.result;
      });
  }

  onSubmit() {
    if (this.busForm.invalid) {
      return;
    }

    this.http.post('http://localhost:8080/register', this.busForm.value).subscribe({
      next: () => {
        alert('User registered successfully');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error:', error);
        alert('Registration failed');
      }
    });
}}
