import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-user-history',
  imports: [CommonModule],
  templateUrl: './user-history.component.html',
  styleUrl: './user-history.component.css'
})
export class UserHistoryComponent {
  private http = inject(HttpClient)
  userHistory: any[] =[]

  constructor(){
    this.fetchHistory()
  }
  fetchHistory(){
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No auth token found! ');
      return;
    }
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get<{ data: string[] }>('http://localhost:8080/api/history', { headers })
      .subscribe(response => {
        this.userHistory = response.data;
        console.log(this.userHistory);
      });
  }

}
