import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-route',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  routes: any[] = [];

  routeForm: FormGroup = this.fb.group({
    id: [''],
    source: ['', Validators.required],
    destination: ['', Validators.required],
    departureDate: ['', Validators.required],
    departureTime: ['', Validators.required],
    price: ['', Validators.required],
    distance: ['', Validators.required]
  });

  get f() {
    return this.routeForm.controls;
  }

  ngOnInit() {
    this.fetchRoutes();
  }

  // Fetch all routes
  fetchRoutes() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<{ status: boolean; data: any[] }>('http://localhost:8080/api/routes/list', { headers })
      .subscribe(response => {
        if (response.status) {
          this.routes = response.data;
        }
      }, error => console.error('Error fetching routes:', error));
  }

  // Save or update route
  onSubmit() {
    if (this.routeForm.invalid) return;

    const routeData = this.routeForm.value;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post('http://localhost:8080/api/routes/save', routeData, { headers })
      .subscribe({
        next: () => {
          alert(routeData.id ? 'Route updated successfully' : 'Route added successfully');
          this.fetchRoutes();
          this.routeForm.reset();
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Operation failed');
        }
      });
  }

  // Edit route
  editRoute(route: any) {
    this.routeForm.patchValue(route);
  }

  // Delete route
  deleteRoute(routeId: number) {
    if (!confirm('Are you sure you want to delete this route?')) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.delete(`http://localhost:8080/api/routes/delete/${routeId}`, { headers })
      .subscribe({
        next: () => {
          alert('Route deleted successfully');
          this.fetchRoutes();
        },
        error: (error) => {
          console.error('Error deleting route:', error);
          alert('Failed to delete route');
        }
      });
  }
}
