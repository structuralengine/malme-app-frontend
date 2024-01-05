import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserInfoService } from 'src/app/providers/user-info.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {
  plans: any[] = [];
  lastSale: any = {};
  hasGroup = false;

  constructor(public userInfo: UserInfoService, private http: HttpClient) {}

  ngOnInit() {
    this.fetchLastSale();
    this.fetchPlans();
    if (this.userInfo.systemProfile && this.userInfo.systemProfile.group) {
      this.hasGroup = true;
    }
  }

  fetchLastSale() {
    this.http.get(`${environment.apiBaseUrl}/sale/last`).subscribe({
      next: (data: any) => {
        this.lastSale = data;
      },
      error: (_error) => {
        console.log('error = ', _error);
      }
    });
  }

  fetchPlans() {
    this.http.get(`${environment.apiBaseUrl}/plan`).subscribe({
      next: (data: any) => {
        this.plans = data;
      },
      error: (_error) => {
        console.log('error = ', _error);
      }
    });
  }

  applyForPlan(planId: number) {
    this.http.post(`${environment.apiBaseUrl}/sale`, { planId }).subscribe({
      next: (data: any) => {
        this.lastSale = data;
      },
      error: (_error) => {
        console.log('error = ', _error);
      }
    });
  }
}
