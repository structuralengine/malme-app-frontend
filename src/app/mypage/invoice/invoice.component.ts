import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MSG_FETCH_FAILED } from 'src/app/helper/notificationMessages';
import { environment } from 'src/environments/environment';

export interface TableRow {
  paymentDay: string;
  plan: string;
  period: string;
  method: string;
  amount: string;
}

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  currentPlan: any = {
    name: '',
    expirationStart: null,
    expirationEnd: null,
    paymentMethod: '',
    contractTitle: '',
    contractContent: '',
    contractUrl: ''
  };
  displayedColumns: string[] = ['paymentDay', 'plan', 'period', 'method', 'amount'];
  dataSource: TableRow[] = [];

  constructor(public dialog: MatDialog, private http: HttpClient, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.http.get(`${environment.apiBaseUrl}/sale/last`).subscribe({
      next: (data: any) => {
        if (data) {
          this.currentPlan = {
            name: data.plan.name,
            expirationStart: data.expirationStart && new Date(data.expirationStart),
            expirationEnd: data.expirationEnd && new Date(data.expirationEnd),
            paymentMethod: data.paymentMethod?.name,
            contractTitle: data.contract?.title,
            contractContent: data.contract?.content,
            contractUrl: data.contract?.url
          };
        }
      },
      error: (_error) =>
        this._snackBar.open(MSG_FETCH_FAILED, 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 5000,
          panelClass: 'notify-failed'
        })
    });
    this.http.get(`${environment.apiBaseUrl}/sale/list`).subscribe({
      next: (data: any) => {
        const paymentHistories: any[] = [];
        data.forEach((sale: any) => {
          paymentHistories.push(
            ...sale.paymentHistories.map((e: any) => {
              return {
                payDate: new Date(e.payDate),
                plan: sale.plan.name,
                closingDate: new Date(e.closingMonth),
                paymentMethod: sale.paymentMethod.name,
                amount: e.price
              };
            })
          );
        });
        this.dataSource = paymentHistories;
      },
      error: (_error) =>
        this._snackBar.open(MSG_FETCH_FAILED, 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 5000,
          panelClass: 'notify-failed'
        })
    });
  }

  openDialog(templateRef: any) {
    const dialogRef = this.dialog.open(templateRef, {});
  }
}
