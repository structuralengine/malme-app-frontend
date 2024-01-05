import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.testHttpCall();
  }

  testHttpCall() {
    this.http.get(`${environment.apiBaseUrl}`).subscribe({
      next: (data: any) => {
        console.log('testHttpCall = ', data);
      },
      error: (error) => {
        console.log('_error = ' + error);
      }
    });
  }
}
