import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserInfoService } from '../providers/user-info.service';
import { environment } from 'src/environments/environment';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { HeaderService } from '../service/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router,
    private readonly keycloak: KeycloakService,
    public userInfo: UserInfoService,
    public header: HeaderService
  ) {}

  ngOnInit() {
    console.log('AppComponent initializing');
    this.userInfo.initializeProfile();
  }

  ngAfterViewInit() {
    console.log('AppComponent ngAfterViewInit');
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout(environment.myURL); //(window.origin);
  }

  signup() {
    this.keycloak.register();
  }

  goMypage() {
    this.router.navigate(['/mypage']);
  }
}
