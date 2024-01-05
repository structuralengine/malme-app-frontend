import { Component, OnInit } from '@angular/core';
import { UserInfoService } from 'src/app/providers/user-info.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentPlanName = '';
  constructor(public userInfo: UserInfoService, private http: HttpClient) {}

  ngOnInit() {
    this.userInfo.syncSystemProfile();
    this.http.get(`${environment.apiBaseUrl}/sale/last`).subscribe({
      next: (data: any) => {
        if (data) {
          this.currentPlanName = data.plan.name;
        }
      },
      error: () => {
        this.currentPlanName = '';
      }
    });
  }

  goTutorial() {
    // window.open('https:');
  }
}
