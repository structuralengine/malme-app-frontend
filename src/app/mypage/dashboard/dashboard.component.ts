import { Component, OnInit } from '@angular/core';
import { UserInfoService } from 'src/app/providers/user-info.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(public userInfo: UserInfoService) {}

  ngOnInit() {
    this.userInfo.syncSystemProfile();
  }

  goTutorial() {
    window.open('https://malme.net');
  }
}
