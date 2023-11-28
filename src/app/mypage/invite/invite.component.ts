import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MSG_INVITE_FAILED,
  MSG_INVITE_SUCCESS,
  MSG_SERVER_ERROR,
  MSG_UPDATE_FAILED,
  MSG_UPDATE_SUCCESS
} from 'src/app/helper/notificationMessages';
import { UserInfoService } from 'src/app/providers/user-info.service';
import { environment } from 'src/environments/environment';

export interface TableRow {
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
  dataSource: TableRow[] = [];

  inviteForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(
    public userInfo: UserInfoService,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.syncTeamMembers();
  }

  get inviteFormControl() {
    return this.inviteForm.controls;
  }

  onSubmitInviteForm() {
    this.invite(this.inviteForm.value.email as string);
  }

  updateRole(email: string) {
    this.http.patch(`${environment.apiBaseUrl}/user/role`, { email }).subscribe({
      next: (_data) => {
        this._snackBar.open(MSG_UPDATE_SUCCESS, 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 5000,
          panelClass: 'notify-success'
        });
        this.syncTeamMembers();
      },
      error: (_error) =>
        this._snackBar.open(MSG_UPDATE_FAILED, 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 5000,
          panelClass: 'notify-failed'
        })
    });
  }

  syncTeamMembers() {
    this.http.get(`${environment.apiBaseUrl}/user/group`).subscribe({
      next: (data: any) => {
        const dataSource: TableRow[] = [];
        data.userList.forEach((element: any) => {
          dataSource.push({
            email: element.email,
            role: element.roles.includes('SuperAdmin')
              ? '最高管理者'
              : element.roles.includes('Admin')
              ? '管理者'
              : 'メンバー',
            status: '',
            action:
              !element.roles.includes('SuperAdmin') && element.roles.includes('Admin')
                ? '管理権限を削除する'
                : !element.roles.includes('Admin')
                ? '管理権限を委託する'
                : ''
          });
        });
        data.pendingInvites.forEach((element: any) => {
          dataSource.push({
            email: element.email,
            role: '',
            status: element.isExpired ? '招待リンクが期限切れ' : '承認待ち',
            action: element.isExpired ? '再招待する' : ''
          });
        });
        this.dataSource = dataSource;
      },
      error: (_error) =>
        this._snackBar.open(MSG_SERVER_ERROR, 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 5000,
          panelClass: 'notify-failed'
        })
    });
  }

  invite(email: string) {
    this.http.post(`${environment.apiBaseUrl}/invite`, { email }).subscribe({
      next: (_data) => {
        this._snackBar.open(MSG_INVITE_SUCCESS, 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 5000,
          panelClass: 'notify-success'
        });
        this.syncTeamMembers();
      },
      error: (_error) =>
        this._snackBar.open(MSG_INVITE_FAILED, 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 5000,
          panelClass: 'notify-failed'
        })
    });
  }
}
