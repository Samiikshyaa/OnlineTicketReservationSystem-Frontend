import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seat-reservation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-reservation.component.html',
  styleUrls: []
})
export class SeatReservationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private router = inject(Router)

  busId: string = '';  
  seats: any[] = []; // Holds seat data
  selectedSeats: number[] = []; // Stores selected seat IDs
  reservationId: number = 0;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.busId = params.get('busId') || ''; 
      if (this.busId) {
        this.fetchBusDetails(this.busId);
      } else {
        console.error('Bus ID not found in route params');
      }
    });
  }
  get chunkedSeats() {
    const totalSeats = [...this.seats]; // Clone to avoid mutation
    const rows: any[] = [];
  
    // Ensure seats are sorted by their seat ID (or seat number if different field)
    totalSeats.sort((a, b) => a.id - b.id);
  
    // Extract the last 5 seats (S23, S24, S25, S26, S27) for the back row
    const backRow = totalSeats.splice(totalSeats.length - 5, 5);
    rows.push({ backRow });
  
    // Process the remaining seats
    const remainingSeats = totalSeats;
  
    // Ensure rows are created with no middle aisle
    if (remainingSeats.length < 4) return rows; // Ensure rows are created if there are enough seats
  
    // Group remaining seats into rows, ensuring no seat is placed in the middle
    for (let i = remainingSeats.length - 1; i >= 0; i -= 4) {
      const rightSide = remainingSeats.slice(Math.max(i - 1, 0), i + 1); // Right side of the row
      const leftSide = remainingSeats.slice(Math.max(i - 3, 0), Math.max(i - 1, 0)); // Left side of the row
  
      rows.unshift({ leftSide, rightSide }); // Add to front to keep order
    }
    
  
    return rows;
  }
  
  
  
  fetchBusDetails(busId: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<{ status: boolean, message: string, data: any[] }>(
      `http://localhost:8080/api/bus/seats/${busId}`, { headers }
    ).subscribe(
      (response) => {
        console.log('API Response:', response);
        if (response.data) {
          this.seats = response.data.map(seat => ({ ...seat })); // Keep original order
        }
      },
      (error) => {
        console.error('Error fetching bus details:', error);
        this.seats = [];
      }
    );
  }

  toggleSeatSelection(seat: any) {
    if (seat.seatStatus === 'RESERVED') return; // Prevent selection of reserved seats

    if (this.selectedSeats.includes(seat.id)) {
      this.selectedSeats = this.selectedSeats.filter(id => id !== seat.id);
    } else {
      this.selectedSeats.push(seat.id);
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

    this.http.post<{ status: boolean, message: string, data: any }>(`http://localhost:8080/api/reservations/reserve`, reservationRequest, { headers })
      .subscribe(
        (response) => {
          console.log('Reservation successful:', response);

          
          if (response.data && response.data.id) {
            this.reservationId = response.data.id;  // Store reservationId if present
            console.log('Reservation ID:', this.reservationId);
            alert('Seats reserved successfully!');
            // Only update seat status, keeping the original order
          this.seats = this.seats.map(seat => {
            if (this.selectedSeats.includes(seat.id)) {
              return { ...seat, seatStatus: 'RESERVED' };
            }
            return seat;
          });
          } else {
            console.error('Reservation ID not received');
          }

          this.selectedSeats = []; // Clear selection
        },
        (error) => {
          console.error('Reservation failed:', error);
          alert('Reservation failed. Please try again.');
        }
      );
  }

  navigateToPayment() {
    if (this.reservationId === 0) {
      alert("Please reserve seats first.");
      return;
    }
    console.log(this.reservationId)
    this.router.navigate(['/payment', this.reservationId]); // Navigate to payment page with reservationId
  }
}
