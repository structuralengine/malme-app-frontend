import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserInfoService } from 'src/app/providers/user-info.service';
import { environment } from 'src/environments/environment';

export interface User {
  email: string;
  roles: string[];
  status: string;
  action: string;
  isExpired: boolean;
}
export interface InviteFormDatas {
  email: string;
  role: string;
  status: string;
  action: string;
}

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {
  displayedColumns: string[] = ['email', 'role', 'status', 'action'];
  inviteDataArray: InviteFormDatas[] = [];
  invitedMessage1 = '';
  invitedMessage2 = '';
  invitedFlag = false;
  memberInputedFlag = false;

  inviteForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(public userInfo: UserInfoService, private http: HttpClient) {}

  ngOnInit() {
    this.syncTeamMembers();
    this.userInfo.syncSystemProfile();
    if (!(this.userInfo.systemProfile && this.userInfo.systemProfile.group)) {
      this.memberInputedFlag = true;
    }
    this.inviteForm.valueChanges.subscribe(() => {
      this.invitedMessage1 = '';
      this.invitedFlag = false;
    });
  }

  get inviteFormControl() {
    return this.inviteForm.controls;
  }

  onSubmitInviteForm() {
    if (!this.invitedFlag) {
      this.invite(this.inviteForm.value.email as string);
    }
    this.invitedFlag = true;
  }

  updateRole(email: string) {
    this.http.patch(`${environment.apiBaseUrl}/user/role`, { email }).subscribe({
      next: (_data) => {
        this.syncTeamMembers();
      },
      error: (_error) => {
        console.log('error = ', _error);
      }
    });
  }

  syncTeamMembers() {
    this.http.get(`${environment.apiBaseUrl}/user/group`).subscribe({
      next: (data: any) => {
        const inviteFormDatas: InviteFormDatas[] = [];
        data.userList.forEach((user: User) => {
          inviteFormDatas.push({
            email: user.email,
            role: user.roles.includes('SuperAdmin')
              ? '最高管理者'
              : user.roles.includes('Admin')
              ? '管理者'
              : 'メンバー',
            status: '',
            action:
              !user.roles.includes('SuperAdmin') && user.roles.includes('Admin')
                ? '管理権限を削除する'
                : !user.roles.includes('Admin')
                ? '管理権限を委託する'
                : ''
          });
        });
        data.pendingInvites.forEach((invitedUser: User) => {
          inviteFormDatas.push({
            email: invitedUser.email,
            role: '',
            status: invitedUser.isExpired ? '招待リンクが期限切れ' : '承認待ち',
            action: invitedUser.isExpired ? '再招待する' : ''
          });
        });
        this.inviteDataArray = inviteFormDatas;
        if (
          this.userInfo.systemProfile &&
          this.userInfo.systemProfile.group &&
          this.userInfo.systemProfile.group.licenses - this.inviteDataArray.length <= 0
        ) {
          this.invitedMessage2 = '招待の上限を超えています';
        } else {
          this.invitedMessage2 = '';
        }
      },
      error: (_error) => {
        console.log('error = ', _error);
      }
    });
  }

  invite(email: string) {
    this.http.post(`${environment.apiBaseUrl}/invite`, { email }).subscribe({
      next: (_data) => {
        this.syncTeamMembers();
        this.invitedMessage1 = '招待メールを送信しました';
      },
      error: (_error) => {
        this.invitedMessage1 = '登録できませんでした。サポートにお問い合わせください';
      }
    });
  }
}
