import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { UserInfoService } from 'src/app/providers/user-info.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  hasGroup = false;
  accountForm = new FormGroup({
    email: new FormControl({ value: '', disabled: true }, Validators.required),
    userRole: new FormControl({ value: '', disabled: true }, Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required)
  });
  groupForm = new FormGroup({
    companyName: new FormControl('', Validators.required),
    departmentName: new FormControl('', Validators.required),
    bankName: new FormControl('', Validators.required),
    bankBranchName: new FormControl('', Validators.required),
    bankAccountType: new FormControl('', Validators.required),
    bankAccountNumber: new FormControl('', Validators.required),
    licenses: new FormControl({ value: 0, disabled: true })
  });
  private userInfoSubscription!: Subscription;
  readonly dialog = inject(MatDialog);
  isLoading = false;

  constructor(public userInfo: UserInfoService, private http: HttpClient) {}

  ngOnInit() {
    this.userInfoSubscription = this.userInfo.userInfo$.subscribe((res) => {
      if (res) {
        if (this.userInfo.systemProfile) {
          this.accountForm.setValue({
            email: this.userInfo.systemProfile.email,
            userRole: this.userInfo.systemProfile?.roles.includes('SuperAdmin')
              ? 'SuperAdmin'
              : this.userInfo.systemProfile?.roles.includes('Admin')
              ? 'Admin'
              : '',
            firstName: this.userInfo.systemProfile.firstName ?? '',
            lastName: this.userInfo.systemProfile.lastName ?? ''
          });
        }

        if (this.userInfo.systemProfile && this.userInfo.systemProfile.group) {
          this.hasGroup = true;
          this.groupForm.setValue({
            companyName: this.userInfo.systemProfile?.group?.companyName ?? null,
            departmentName: this.userInfo.systemProfile?.group?.departmentName ?? null,
            bankName: this.userInfo.systemProfile?.group?.bankName ?? null,
            bankBranchName: this.userInfo.systemProfile?.group?.bankBranchName ?? null,
            bankAccountType: this.userInfo.systemProfile?.group?.bankAccountType ?? null,
            bankAccountNumber: this.userInfo.systemProfile?.group?.bankAccountNumber ?? null,
            licenses: this.userInfo.systemProfile?.group?.licenses ?? 0
          });
        }
      }
    });
  }

  ngOnDestroy() {
    this.userInfoSubscription.unsubscribe();
  }

  get accountFormControl() {
    return this.accountForm.controls;
  }

  get groupFormControl() {
    return this.groupForm.controls;
  }

  onSubmitAccountForm() {
    this.isLoading = true;
    this.http
      .patch(`${environment.apiBaseUrl}/user/update-user`, {
        id: this.userInfo.systemProfile?.id ?? 0,
        licenses: this.groupForm.controls.licenses.value,
        ...this.accountForm.value
      })
      .subscribe({
        next: (res: any) => {
          this.setSystemProfile(res);
          this.isLoading = false;
        },
        error: (_error) => {
          console.log('error = ', _error);
          this.isLoading = false;
          this.dialog.open(ConfirmDialogComponent, {
            data: {
              title:
                '現在システムで問題が発生しているため、処理を完了できませんでした。 \n恐れ入りますが、再度お試しください。',
              acceptBtn: 'OK'
            }
          });
        }
      });
  }

  onOpenAccountDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '会員情報を変更してもよろしいでしょうか？',
        message: '',
        acceptBtn: 'OK',
        cancelBtn: 'キャンセル'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onSubmitAccountForm();
      }
    });
  }

  onSubmitGroupForm() {
    if (!this.hasGroup) {
      this.isLoading = true;
      this.http
        .patch(`${environment.apiBaseUrl}/user/update-user`, {
          userId: this.userInfo.systemProfile?.id ?? 0,
          licenses: this.groupForm.controls.licenses.value,
          ...this.groupForm.value
        })
        .subscribe({
          next: (res: any) => {
            this.hasGroup = true;
            this.setSystemProfile(res);
            this.isLoading = false;
          },
          error: (_error) => {
            console.log('error = ', _error);
            this.isLoading = false;
            this.dialog.open(ConfirmDialogComponent, {
              data: {
                title:
                  '現在システムで問題が発生しているため、処理を完了できませんでした。 \n恐れ入りますが、再度お試しください。',
                acceptBtn: 'OK'
              }
            });
          }
        });
    } else {
      this.isLoading = true;
      this.http
        .patch(`${environment.apiBaseUrl}/user/update-user`, {
          userId: this.userInfo.systemProfile?.id ?? 0,
          licenses: this.groupForm.controls.licenses.value,
          ...this.groupForm.value
        })
        .subscribe({
          next: (res: any) => {
            this.hasGroup = true;
            this.setSystemProfile(res);
            this.isLoading = false;
          },
          error: (_error) => {
            console.log('error = ', _error);
            this.isLoading = false;
          }
        });
    }
  }

  onOpenGroupDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '会社情報を変更してもよろしいでしょうか？',
        message: '',
        acceptBtn: 'OK',
        cancelBtn: 'キャンセル'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onSubmitGroupForm();
      }
    });
  }

  setSystemProfile(res: any) {
    const group: any = {
      id: res.company.id,
      status: res.company.status,
      companyName: res.company.companyName,
      departmentName: res.company.departmentName,
      bankName: res.company.bankName,
      bankBranchName: res.company.bankBranchName,
      bankAccountType: res.company.bankAccountType,
      bankAccountNumber: res.company.bankAccountNumber
    };

    this.userInfo.systemProfile = {
      id: res.id,
      uid: res.azureB2CId,
      firstName: res.firstName,
      lastName: res.lastName,
      email: res.email,
      roles: res.roles,
      group: group ?? null
    };
  }
}
