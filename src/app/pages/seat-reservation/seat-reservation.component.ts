import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seat-reservation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-reservation.component.html',
  styleUrl: './seat-reservation.component.css'
})
export class SeatReservationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  busId: string = '';  
  seats: any[] = [];
  selectedSeats: number[] = []; 

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.busId = params.get('busId') || ''; // Ensure non-null
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

    this.http.get<{ status: boolean, message: string, data: any[] }>(
      `http://localhost:8080/api/bus/seats/${busId}`, { headers }
    ).subscribe(
      (response) => {
        console.log('API Response:', response);
        this.seats = response.data || [];
      },
      (error) => {
        console.error('Error fetching bus details:', error);
        this.seats = [];
      }
    );
  }

  toggleSeatSelection(seat: any) {
    if (seat.seatStatus === 'RESERVED') return; // Prevent selecting reserved seats

    if (this.selectedSeats.includes(seat.id)) {
      this.selectedSeats = this.selectedSeats.filter(id => id !== seat.id); // Deselect seat
    } else {
      this.selectedSeats.push(seat.id); // Select seat
    }
  }

  reserveSeats() {
    if (this.selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const reservationRequest = {
      busId: Number(this.busId),
      seatNumbers: this.selectedSeats
    };

    this.http.post(`http://localhost:8080/api/reservations/reserve`, reservationRequest, { headers })
      .subscribe(
        (response) => {
          console.log('Reservation successful:', response);
          alert('Seats reserved successfully!');
          this.fetchBusDetails(this.busId); // Refresh seat data after reservation
        },
        (error) => {
          console.error('Reservation failed:', error);
          alert('Reservation failed. Please try again.');
        }
      );
  }
}
