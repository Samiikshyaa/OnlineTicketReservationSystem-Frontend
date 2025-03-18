import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./pages/navbar/navbar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'onlineTicketFront';

  constructor(private router: Router) {}

  shouldShowNavbar(): boolean {
    const hiddenRoutes = ['/login', '/register']; // Routes where navbar should be hidden
    return !hiddenRoutes.includes(this.router.url);
  }
}
