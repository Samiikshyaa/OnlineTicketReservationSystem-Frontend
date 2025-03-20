import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuardGuard } from './guards/auth-guard.guard';
import { BusRouteComponent } from './pages/bus-route/bus-route.component';
import { BusComponent } from './pages/bus/bus.component';
import { RouteComponent } from './pages/route/route.component';
import { SeatReservationComponent } from './pages/seat-reservation/seat-reservation.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { TicketComponent } from './pages/ticket/ticket.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuardGuard] },
//   { path: 'busRoute', component: BusRouteComponent, canActivate: [authGuardGuard] },
  { path: 'bus', component: BusComponent, canActivate: [authGuardGuard] },
  { path: 'bus-route', component: BusRouteComponent, canActivate: [authGuardGuard] },
  { path: 'route', component: RouteComponent, canActivate: [authGuardGuard] },
  // Seat reservation route expecting a busId parameter
  { path: 'seat-reserve/:busId', component: SeatReservationComponent, canActivate: [authGuardGuard] },
  {path:'payment/:reservationId', component:PaymentComponent, canActivate:[authGuardGuard]},
  {path:'ticket/:paymentId', component:TicketComponent, canActivate:[authGuardGuard]},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
