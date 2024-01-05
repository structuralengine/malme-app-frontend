import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderService } from '../service/header.service';
import { FooterService } from '../service/footer.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-dxlogin2023',
  templateUrl: './dxlogin2023.component.html',
  styleUrls: ['./dxlogin2023.component.scss']
})
export class Dxlogin2023Component implements OnInit, OnDestroy {
  constructor(
    private http: HttpClient,
    private header: HeaderService,
    private footer: FooterService
  ) {}

  public form!: FormGroup;
  public resultMessage1 = '';
  public resultMessage2 = '';
  public rejistOK = true;

  ngOnInit() {
    this.header.hide();
    this.footer.hide();
    this.form = new FormGroup({
      emailControl: new FormControl('', [Validators.required, Validators.email])
    });
  }

  public onClickOK() {
    const inputValue: any = {
      input: this.form.controls['emailControl'].value
    };
    console.log('inputValue', inputValue);
    this.createUser(inputValue);
  }

  createUser(email: string) {
    this.http.post(`${environment.apiBaseUrl}/invite/create`, { email: email }).subscribe({
      next: (data: any) => {
        console.log('data =', data);
        this.rejistOK = true;
        this.resultMessage1 = '登録されました';
        this.resultMessage2 = 'メールをご確認ください';
      },
      error: (_error) => {
        this.rejistOK = false;
        this.resultMessage1 = '登録に失敗しました';
        this.resultMessage2 = '';
      }
    });
  }
  getKeyupEvent() {
    this.resultMessage1 = '';
    this.resultMessage2 = '';
  }

  ngOnDestroy() {
    this.header.show();
    this.footer.show();
  }
}
