import { Component, inject } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeatReservationComponent } from "../seat-reservation/seat-reservation.component";

@Component({
  selector: 'app-bus-route',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, SeatReservationComponent],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-semibold text-center mb-4">Bus Routes</h2>

      <div class="flex gap-4 mb-4">
        <!-- Source Dropdown -->
        <select [(ngModel)]="selectedSource" (change)="filterRoutes()" class="p-2 border rounded w-1/3">
          <option value="">Select Source</option>
          <option *ngFor="let route of uniqueSources" [value]="route">{{ route }}</option>
        </select>

        <!-- Destination Dropdown -->
        <select [(ngModel)]="selectedDestination" (change)="filterRoutes()" class="p-2 border rounded w-1/3">
          <option value="">Select Destination</option>
          <option *ngFor="let route of uniqueDestinations" [value]="route">{{ route }}</option>
        </select>
      </div>

      <!-- Bus List -->
      <div class="bus-list-header flex justify-between items-center p-3 border-b bg-white">
        <span class="text-lg font-semibold">Bus Number</span>
        <span class="text-lg font-semibold">Capacity</span>
        <span class="text-lg font-semibold">Distance</span>
        <span class="text-lg font-semibold">Price</span>
        <span class="text-lg font-semibold"></span>
      </div>
      <div *ngFor="let bus of filteredBuses" class="flex justify-between items-center p-3 border-b">
        <span class="text-lg font-semibold">{{ bus.busNumber }}</span>
        <span class="text-lg font-semibold">{{ bus.capacity }}</span>
        <span class="text-lg font-semibold">{{ bus.distance}}</span>
        <span class="text-lg font-semibold">{{ bus.price}}</span>
        <button (click)="selectBus(bus)" class="bg-blue-500 text-white px-4 py-2 rounded">View Seats</button>
      </div>

      <!-- Seat Reservation Popup -->
      <app-seat-reservation *ngIf="selectedBus" [bus]="selectedBus" (close)="selectedBus = null"></app-seat-reservation>
    </div>`,
    styles: [`
    .bus-list-header {
      position: sticky;
      top: 0;
      z-index: 10;
      background-color: white;
    }
  `]
})
export class BusRouteComponent {
  private http = inject(HttpClient);

  routes: any[] = [];
  filteredBuses: any[] = [];
  selectedBus: any | null = null;
  selectedSource: string = '';
  selectedDestination: string = '';

  uniqueSources: string[] = [];
  uniqueDestinations: string[] = [];

  constructor() {
    this.fetchRoutes();
  }

  fetchRoutes() {
    const token = localStorage.getItem('token'); // Get JWT token
    if (!token) {
      console.error('No auth token found!');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });


    this.http.get<{ data: string[] }>('http://localhost:8080/api/routes/sources', { headers })
      .subscribe(response => {
        this.uniqueSources = response.data;
      });
  }

  /** 🔹 Method to filter routes based on selected source and destination */
  filterRoutes() {
    if (!this.selectedSource) {
      this.uniqueDestinations = [];
      this.filteredBuses = [];
      return;
    }

    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    // Fetch destinations based on selected source
    this.http.get<{ data: string[] }>(`http://localhost:8080/api/routes/destinations?source=${this.selectedSource}`, { headers })
      .subscribe(response => {
        this.uniqueDestinations = response.data;
      });

    
    // Fetch bus details when both source & destination are selected
    if (this.selectedDestination) {
      const token = localStorage.getItem('token'); 
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      this.http.get<{ data: any[] }>(
        `http://localhost:8080/api/routes/bus-route-details?source=${this.selectedSource}&destination=${this.selectedDestination}`,
        { headers }
      ).subscribe(response => {
        this.filteredBuses = response.data;
      });
    }
  }

  /** 🔹 Method to select a bus */
  selectBus(bus: any) {
    this.selectedBus = bus;
  }
}
