import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  message: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('http://localhost:5000/api/users', {
      withCredentials: true
    })
    .subscribe((res: any) => {
      this.message = `Hi ${res.name}`;
    }, (err) => {
      this.message = "You";
    });
  }
}

