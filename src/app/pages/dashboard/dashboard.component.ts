import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, NgxChartsModule],
  template: `
    <div class="flex justify-center items-center h-screen bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 class="text-2xl font-semibold text-center mb-4">Dashboard</h2>
        <p class="text-center text-gray-700">Welcome to your dashboard!</p>
        
        <button (click)="logout()" 
        class="absolute top-4 right-4 bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition duration-300">
          Logout
        </button>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-4">Reservations Overview</h3>
        <ngx-charts-bar-vertical
          [results]="chartData"
          [xAxis]="true"
          [yAxis]="true"
          [legend]="false"
          [showDataLabel]="true"
          [gradient]="false"
          [showGridLines]="true">
        </ngx-charts-bar-vertical>
      </div>
    </div>
  `
})
export class DashboardComponent {
  private router = inject(Router);
  private http = inject(HttpClient);
  isAdmin: boolean = false;
  chartData: any[] = [];

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      const role = decodedToken.role;

      if (role !== 'admin') {
        this.router.navigate(['/bus-route']);
        return;
      }

      this.isAdmin = true;
      this.loadDashboardData();
    } catch (error) {
      console.error('Error decoding token:', error);
      this.router.navigate(['/login']);
    }
  }

  loadDashboardData() {
    this.http.get<{ data: { count: number } }>('http://localhost:8080/api/dashboard/daily').subscribe(
      (daily) => this.chartData.push({ name: 'Daily', value: daily.data.count })
    );
    this.http.get<{ data: { count: number } }>('http://localhost:8080/api/dashboard/weekly').subscribe(
      (weekly) => this.chartData.push({ name: 'Weekly', value: weekly.data.count })
    );
    this.http.get<{ data: { count: number } }>('http://localhost:8080/api/dashboard/monthly').subscribe(
      (monthly) => this.chartData.push({ name: 'Monthly', value: monthly.data.count })
    );
    this.http.get<{ data: { count: number } }>('http://localhost:8080/api/dashboard/yearly').subscribe(
      (yearly) => this.chartData.push({ name: 'Yearly', value: yearly.data.count })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
