import { Component, inject } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bus-route',
  standalone: true,
  // Note: We removed SeatReservationComponent from the imports because we are not embedding it here.
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './bus-route.component.html',
  styleUrl:'./bus-route.component.css'
})
export class BusRouteComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  filteredBuses: any[] = [];
  selectedSource: string = '';
  selectedDestination: string = '';

  uniqueSources: string[] = [];
  uniqueDestinations: string[] = [];

  constructor() {
    this.fetchRoutes();
  }

  fetchRoutes() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No auth token found!');
      return;
    }
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get<{ data: string[] }>('http://localhost:8080/api/routes/sources', { headers })
      .subscribe(response => {
        this.uniqueSources = response.data;
      });
  }

  filterRoutes() {
    if (!this.selectedSource) {
      this.uniqueDestinations = [];
      this.filteredBuses = [];
      return;
    }
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    // Fetch destinations for the selected source
    this.http.get<{ data: string[] }>(`http://localhost:8080/api/routes/destinations?source=${this.selectedSource}`, { headers })
      .subscribe(response => {
        this.uniqueDestinations = response.data;
      });
    // Fetch bus details when both source and destination are selected
    if (this.selectedDestination) {
      this.http.get<{ data: any[] }>(
        `http://localhost:8080/api/routes/bus-route-details?source=${this.selectedSource}&destination=${this.selectedDestination}`,
        { headers }
      ).subscribe(response => {
        this.filteredBuses = response.data;
      });
    }
  }

  selectBus(bus: any) {
    if (!bus || !bus.id) {
      console.error('Bus ID is missing or invalid', bus);
      return;
    }
    this.router.navigate(['/seat-reserve', bus.id]); 
  }
  
}
