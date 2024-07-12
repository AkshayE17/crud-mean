import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ContactComponent } from './components/contact/contact.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path:'',component:HomeComponent},
  { path:'admin',component:AdminComponent},
  { path:'admindashboard',component:AdminDashboardComponent},
  { path:'contact',component:ContactComponent},
  { path:'login',component:LoginComponent },
  { path:'register',component:RegisterComponent},
  {path:'dashboard',component:DashboardComponent}

];
