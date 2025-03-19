import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bus',
  imports:[CommonModule,ReactiveFormsModule],
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.css']
})
export class BusComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  routes: any[] = [];
  buses: any[] = [];

  busForm: FormGroup = this.fb.group({
    id: [''],
    busNumber: ['', [Validators.required, Validators.minLength(3)]],
    capacity: ['', [Validators.required, Validators.min(1)]],
    routeId: ['', Validators.required]
  });

  get f(): { [key: string]: any } {
    return this.busForm.controls;
  }

  ngOnInit() {
    this.fetchRoutes();
    this.fetchBuses();
  }

  // Fetch Routes
  fetchRoutes() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<{ status: boolean; data: any[] }>('http://localhost:8080/api/routes/list', { headers })
      .subscribe(response => {
        if (response.status) {
          this.routes = response.data;
          console.log('Routes:', this.routes);
        }
      }, error => console.error('Error fetching routes:', error));
  }

  // Fetch Buses
  fetchBuses() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<{ status: boolean; data: any[] }>('http://localhost:8080/api/bus/list', { headers })
      .subscribe(response => {
        if (response.status) {
          this.buses = response.data;
          console.log('Buses:', this.buses);
        }
      }, error => console.error('Error fetching buses:', error));
  }

  // Save or Update Bus
  onSubmit() {
    if (this.busForm.invalid) return;

    const busData = this.busForm.value;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post('http://localhost:8080/api/bus/save', busData, { headers })
      .subscribe({
        next: () => {
          alert(busData.id ? 'Bus updated successfully' : 'Bus added successfully');
          this.fetchBuses();
          this.busForm.reset();
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Operation failed');
        }
      });
  }

  // Edit Bus
  editBus(bus: any) {
    this.busForm.patchValue({
      id: bus.id,
      busNumber: bus.busNumber,
      capacity: bus.capacity,
      routeId: bus.routeId
    });
  }

  // Delete Bus
  deleteBus(busId: number) {
    if (!confirm('Are you sure you want to delete this bus?')) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.delete(`http://localhost:8080/api/bus/delete/${busId}`, { headers })
      .subscribe({
        next: () => {
          alert('Bus deleted successfully');
          this.fetchBuses();
        },
        error: (error) => {
          console.error('Error deleting bus:', error);
          alert('Failed to delete bus');
        }
      });
  }
}
