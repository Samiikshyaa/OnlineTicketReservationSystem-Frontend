import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seat-reservation',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-6 rounded shadow-lg w-1/2">
        <h3 class="text-lg font-semibold mb-4">Select Seats for Bus: {{ bus.busNumber }}</h3>

        <!-- Seat Layout -->
        <div class="grid grid-cols-6 gap-2">
          <button
            *ngFor="let seat of seats"
            [class.bg-gray-500]="seat.status === 'booked'"
            [class.bg-green-500]="seat.selected"
            [class.bg-red-300]="seat.status === 'reserved-female'"
            [class.bg-blue-300]="seat.status === 'reserved-male'"
            class="w-10 h-10 border rounded flex items-center justify-center"
            (click)="toggleSeat(seat)"
          >
            {{ seat.number }}
          </button>
        </div>

        <!-- Actions -->
        <div class="flex justify-between mt-4">
          <button (click)="reserveSeats()" class="bg-blue-500 text-white px-4 py-2 rounded">Reserve</button>
          <button (click)="close.emit()" class="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
        </div>
      </div>
    </div>
  `
})
export class SeatReservationComponent {
  private http = inject(HttpClient);

  @Input() bus: any;
  @Output() close = new EventEmitter<void>();

  seats: any[] = [];

  ngOnInit() {
    this.fetchSeats();
  }

  fetchSeats() {
    this.http.get<any[]>(`/api/seats/${this.bus.id}`).subscribe(response => {
      this.seats = response;
    });
  }

  toggleSeat(seat: any) {
    if (seat.status !== 'booked') {
      seat.selected = !seat.selected;
    }
  }

  reserveSeats() {
    const selectedSeats = this.seats.filter(seat => seat.selected).map(seat => seat.number);
    this.http.post('/api/reservations/reserve', { busId: this.bus.id, seatNumbers: selectedSeats }).subscribe(() => {
      alert('Seats reserved successfully!');
      this.close.emit();
    });
  }
}
