import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MSG_CREATE_FAILED,
  MSG_CREATE_SUCCESS,
  MSG_UPDATE_FAILED,
  MSG_UPDATE_SUCCESS
} from 'src/app/helper/notificationMessages';
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
    email: new FormControl('', Validators.required),
    userRole: new FormControl({ value: '', disabled: true }, Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required)
  });
  groupForm = new FormGroup({
    name: new FormControl('', Validators.required),
    department: new FormControl('', Validators.required),
    type: new FormControl(0, Validators.required),
    zipcode: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    tel: new FormControl('', Validators.required),
    bankName: new FormControl('', Validators.required),
    bankBranchName: new FormControl('', Validators.required),
    bankAccountType: new FormControl('', Validators.required),
    bankAccountNumber: new FormControl('', Validators.required),
    licenses: new FormControl({ value: 0, disabled: true })
  });

  constructor(
    public userInfo: UserInfoService,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userInfo.syncSystemProfile().add(() => {
      if (this.userInfo.keycloakProfile?.username) {
        this.accountForm.setValue({
          email: this.userInfo.keycloakProfile.email,
          userRole: this.userInfo.systemProfile?.roles.includes('SuperAdmin')
            ? 'SuperAdmin'
            : this.userInfo.systemProfile?.roles.includes('Admin')
            ? 'Admin'
            : '',
          firstName: this.userInfo.keycloakProfile.firstName ?? '',
          lastName: this.userInfo.keycloakProfile.lastName ?? ''
        });
      }
      if (this.userInfo.systemProfile && this.userInfo.systemProfile.group) {
        this.hasGroup = true;
        this.groupForm.setValue({
          type: this.userInfo.systemProfile?.group?.type ?? null,
          name: this.userInfo.systemProfile?.group?.name ?? null,
          department: this.userInfo.systemProfile?.group?.department ?? null,
          zipcode: this.userInfo.systemProfile?.group?.zipcode ?? null,
          address: this.userInfo.systemProfile?.group?.address ?? null,
          tel: this.userInfo.systemProfile?.group?.tel ?? null,
          bankName: this.userInfo.systemProfile?.group?.bankName ?? null,
          bankBranchName: this.userInfo.systemProfile?.group?.bankBranchName ?? null,
          bankAccountType: this.userInfo.systemProfile?.group?.bankAccountType ?? null,
          bankAccountNumber: this.userInfo.systemProfile?.group?.bankAccountNumber ?? null,
          licenses: this.userInfo.systemProfile?.group?.licenses ?? 0
        });
      }
    });
  }

  get accountFormControl() {
    return this.accountForm.controls;
  }

  get groupFormControl() {
    return this.groupForm.controls;
  }

  onSubmitAccountForm() {
    this.http
      .put(`${environment.apiBaseUrl}/user`, {
        id: this.userInfo.systemProfile?.id ?? 0,
        licenses: this.groupForm.controls.licenses.value,
        ...this.accountForm.value
      })
      .subscribe({
        next: (data) => {
          if (data == 204) {
            this._snackBar.open(MSG_UPDATE_SUCCESS, 'Close', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 5000,
              panelClass: 'notify-success'
            });
            this.userInfo.setKeycloakProfile(this.accountForm.value);
          } else {
            this._snackBar.open(MSG_UPDATE_FAILED, 'Close', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 5000,
              panelClass: 'notify-failed'
            });
          }
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

  onSubmitGroupForm() {
    if (!this.hasGroup) {
      this.http
        .post(`${environment.apiBaseUrl}/group`, {
          userId: this.userInfo.systemProfile?.id ?? 0,
          licenses: this.groupForm.controls.licenses.value,
          ...this.groupForm.value
        })
        .subscribe({
          next: (_data) => {
            this._snackBar.open(MSG_CREATE_SUCCESS, 'Close', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 5000,
              panelClass: 'notify-success'
            });
            this.hasGroup = true;
          },
          error: (_error) =>
            this._snackBar.open(MSG_CREATE_FAILED, 'Close', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 5000,
              panelClass: 'notify-failed'
            })
        });
    } else {
      this.http
        .put(`${environment.apiBaseUrl}/group`, {
          userId: this.userInfo.systemProfile?.id ?? 0,
          licenses: this.groupForm.controls.licenses.value,
          ...this.groupForm.value
        })
        .subscribe({
          next: (_data) => {
            this._snackBar.open(MSG_UPDATE_SUCCESS, 'Close', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 5000,
              panelClass: 'notify-success'
            });
            this.hasGroup = true;
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
  }
}
