import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  imports:[ReactiveFormsModule, CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  reservationId: string = '';
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
      transactionId: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^[a-zA-Z0-9]+$')]],
      paymentMethod: ['', Validators.required]
    });
    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.reservationId = params.get('reservationId') || '';
      if (this.reservationId) {
        this.fetchTicketDetails(this.reservationId);
      } else {
        console.error('Reservation ID not found.');
      }
    });
  }

  fetchTicketDetails(reservationId: string) {
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
      reservationId: Number(this.reservationId)
    };
  
    this.http.post<{ status: boolean, message: string, data: any }>(
      'http://localhost:8080/api/payment/save', paymentRequest, { headers }
    ).subscribe(
      (response) => {
        console.log("Payment Successful:", response)
        alert("Payment Successful")
        if(response.data && response.data.paymentId){
            this.paymentId = response.data.paymentId;
            console.log("PaymentId:", this.paymentId);
        // Navigate to ticket page with paymentId
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

  getTicket(){
    if(this.paymentId === 0){
      alert("An error occured")
    }
    console.log(this.paymentId)
    this.router.navigate(['/ticket', this.paymentId])
  }
}
