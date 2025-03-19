import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  imports:[ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  reservationId: number = 0;
  ticket: any = null; // Will hold the ticket data
  paymentForm: FormGroup; // Reactive form group
  paymentId: number= 0;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder // Injecting FormBuilder
  ) {
    // Initialize the payment form with form controls
    this.paymentForm = this.fb.group({
      transactionId: ['', Validators.required],
      paymentMethod: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.reservationId = Number(params.get('id'));
      if (this.reservationId) {
        this.fetchTicketDetails(this.reservationId);
      } else {
        console.error('Reservation ID not found.');
      }
    });
  }

  fetchTicketDetails(reservationId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<{ status: boolean, message: string, data: any }>(
      `http://localhost:8080/api/payment/ticket/${reservationId}`, { headers }
    ).subscribe(
      (response) => {
        if (response.data) {
          this.ticket = response.data; // Store the fetched ticket details
        }
      },
      (error) => {
        console.error('Error fetching ticket:', error);
        alert('Failed to fetch ticket details. Please try again.');
      }
    );
  }

  makePayment() {
    if (this.paymentForm.invalid) {
      alert("Please fill in all the payment details.");
      return;
    }
  
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  
    const paymentRequest = {
      transactionId: this.paymentForm.value.transactionId,
      paymentMethod: this.paymentForm.value.paymentMethod,
      reservationId: this.reservationId
    };
  
    this.http.post<{ status: boolean, message: string, data: any }>(
      'http://localhost:8080/api/payment/save', paymentRequest, { headers }
    ).subscribe(
      (response) => {
        if (response.status) {
          alert('Payment successful!');
          this.paymentId = response.data.paymentId; // Assume paymentId is returned in response
          this.onClick(); // Navigate to ticket page with paymentId
        } else {
          alert('Payment failed. Please try again.');
        }
      },
      (error) => {
        console.error('Error making payment:', error);
        alert('An error occurred while processing the payment.');
      }
    );
  }

  onClick(){
    this.router.navigate(['/ticket', this.paymentId])
  }
}
