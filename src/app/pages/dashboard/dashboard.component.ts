import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables)
@Component({
  selector: 'app-dashboard',
  imports: [HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);

  busByRoute: any[] = [];
  reservationsByRoute: any[] = [];
  labeldata: string[] = [];
  realdata: number[] = [];

  routedata: string[] =[];
  reservationCount: number[] =[];

  constructor() {
    this.fetchBusByRoute()
    this.fetchReservationByRoute()
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  fetchBusByRoute() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No auth token found! ');
      return;
    }
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get<{ data: string[] }>('http://localhost:8080/api/dashboard/busCountByRoute', { headers })
      .subscribe(response => {
        this.busByRoute = response.data;
        console.log(this.busByRoute);
        if (this.busByRoute != null) {
          this.busByRoute.map(o => {
            this.labeldata.push(o.routeName);
            this.realdata.push(o.busCount);
          });
          this.RenderPieChar(this.labeldata,this.realdata);
        }
      });
  }


  fetchReservationByRoute(){
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No auth token found! ');
      return;
    }
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get<{ data: string[] }>('http://localhost:8080/api/dashboard/reservationsByRoute', { headers })
      .subscribe(response => {
        this.reservationsByRoute = response.data;
        if (this.reservationsByRoute != null) {
          this.reservationsByRoute.map(o => {
            this.routedata.push(o.routeName);
            this.reservationCount.push(o.reservationCount);
          });
          this.RenderBarChar(this.routedata,this.reservationCount);
        }
      });
  }

  RenderPieChar(labeldata: any, valuedata: any) {
    this.Renderchar(labeldata, valuedata, 'piechart', 'pie');

  }

  RenderBarChar(labeldata: any, valuedata: any){
    // this.Renderchar(labeldata,valuedata,'barchart', 'bar');
    const mychar = new Chart('barchart', {
      type: 'bar',
      data: {
        labels: labeldata,
        datasets: [{
          label: 'Total Reservations',
          data: valuedata
          // backgroundColor: 
        }]
      },
      options: {

      }
    });

  }

  Renderchar(labeldata: any, valuedata: any, chartid: string, charttype: any) {
    const mychar = new Chart(chartid, {
      type: charttype,
      data: {
        labels: labeldata,
        datasets: [{
          label: 'Total Bus',
          data: valuedata
          // backgroundColor: 
        }]
      },
      options: {

      }
    });

  }

}

