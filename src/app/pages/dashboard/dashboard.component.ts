import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(... registerables)
@Component({
  selector: 'app-dashboard',
  imports: [HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  private http = inject(HttpClient);

  busByRoute: any[] = [];
  constructor(){
   this.fetchBusByRoute()
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  fetchBusByRoute(){
    const token = localStorage.getItem('token');
    if(!token){
      console.error('No auth token found! ');
      return;
    }
    const headers = new HttpHeaders({'Authorization':`Bearer ${token}`});
    this.http.get<{data: string[]}>('http://localhost:8080/api/dashboard/busCountByRoute',{headers})
    .subscribe(response => {
      this.busByRoute = response.data;
      console.log(this.busByRoute);
    });

  }

  }

