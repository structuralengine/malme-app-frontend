import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

export interface TableRow {
  paymentDay: string;
  plan: string;
  period: string;
  method: string;
  amount: string;
}
export interface SaleInfo {
  name: string;
  expirationStart: Date;
  expirationEnd: Date;
  paymentMethod: string;
  contractTitle: string;
  contractContent: string;
  contractUrl: string;
}
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  currentSaleInfo: SaleInfo = {
    name: '',
    expirationStart: new Date(),
    expirationEnd: new Date(),
    paymentMethod: '',
    contractTitle: '',
    contractContent: '',
    contractUrl: ''
  };
  displayedColumns: string[] = ['paymentDay', 'plan', 'period', 'method', 'amount'];
  dataSource: TableRow[] = [];
  hasExpirationDate = true;

  constructor(public dialog: MatDialog, private http: HttpClient) {}

  ngOnInit() {
    this.http.get(`${environment.apiBaseUrl}/sale/last`).subscribe({
      next: (data: any) => {
        if (data) {
          this.currentSaleInfo = {
            name: data.plan.name,
            expirationStart: data.expirationStart && new Date(data.expirationStart),
            expirationEnd: data.expirationEnd && new Date(data.expirationEnd),
            paymentMethod: data.paymentMethod?.name ?? '',
            contractTitle: data.contract?.title ?? '',
            contractContent: data.contract?.content ?? '',
            contractUrl: data.contract?.url ?? ''
          };
          console.log('current plan =' + JSON.stringify(this.currentSaleInfo, null, 2));
        }
      },
      error: (_error) => {
        this.currentSaleInfo.name = '';
        this.hasExpirationDate = false;
      }
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
      error: (_error) => {
        this.currentSaleInfo.name = '';
        this.hasExpirationDate = false;
      }
    });
  }

  openDialog(templateRef: any) {
    const dialogRef = this.dialog.open(templateRef, {});
  }
}
