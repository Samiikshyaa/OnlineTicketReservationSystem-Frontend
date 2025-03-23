import { HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./pages/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Online Ticket Reservation';
  private router = inject(Router)
  constructor(private titleService: Title) {
    this.titleService.setTitle('Online Ticket Reservation System');
  }

  shouldShowNavbar(): boolean {
    const hiddenRoutes = ['/login', '/register']; 
    return !hiddenRoutes.includes(this.router.url);
  }
}
