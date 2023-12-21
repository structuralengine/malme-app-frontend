import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss']
})
export class InvitationComponent implements OnInit {
  routeParams: Params = {};
  inviteSuccess: boolean | null = null;
  groupName = '';
  message = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.http
        .post(`${environment.apiBaseUrl}/invite/accept/${params.get('slug')}`, {})
        .subscribe({
          next: (data: any) => {
            this.inviteSuccess = true;
            if (data.existingUser) {
              // Handle when existing keycloak user invited to an group
              this.groupName = data.group.name;
            } else {
              // Handle when new user created in keycloak
              this.groupName = data.group.name;
              this.message = 'また、メールでパスワードを送信しましたのでご確認ください。';
            }
          },
          error: (error) => {
            // Handle when error occurred
            this.inviteSuccess = false;
            if (error.error.message == 'Already has an group') {
              this.router.navigate(['/mypage']);
            }
          }
        });
    });
  }
}
