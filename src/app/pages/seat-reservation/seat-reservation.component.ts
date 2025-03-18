import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seat-reservation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="bus" class="modal">
      <h2>Seat Reservation for Bus: {{ bus?.busNumber }}</h2>
      <ul>
        
          <div *ngFor="let seat of seats">
          <li>{{ seat}}
        </li>
</div>
      </ul>
      <button (click)="close()">Close</button>
    </div>
  `,
})
export class SeatReservationComponent implements OnInit {
  bus: any;
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  busId: string | null = null;
  seats: any[] = [];

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.busId = params.get('busId');
      if (this.busId) {
        this.fetchBusDetails(this.busId);
      } else {
        console.error('Bus ID not found in route params');
      }
    });
  }

  fetchBusDetails(busId: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http
      .get<{ result: any[] }>(`http://localhost:8080/api/bus/seats/${busId}`, {
        headers,
      })
      .subscribe((response) => {
        this.seats = response.result;
      });
  }

  close() {
    history.back();
  }
}
