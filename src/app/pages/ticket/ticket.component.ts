import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket',
  imports:[CommonModule],
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {
  paymentId: number = 0;
  ticket: any = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.paymentId = Number(params.get('paymentId')); // Retrieve paymentId from the URL
      if (this.paymentId) {
        this.fetchTicketDetails(this.paymentId);
      } else {
        console.error('Payment ID not found.');
      }
    });
  }

  fetchTicketDetails(paymentId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<{ status: boolean, message: string, data: any }>(
      `http://localhost:8080/api/payment/final-ticket/${paymentId}`, { headers }
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
}
