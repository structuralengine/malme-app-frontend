import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HeaderService } from './service/header.service';
import { FooterService } from './service/footer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'MalmeApp | 構造解析サービス';

  constructor(private header: HeaderService, private footer: FooterService) {}

  ngOnInit() {
    console.log('AppComponent initializing');
    this.header.show();
    this.footer.show();
  }

  ngAfterViewInit() {
    console.log('AppComponent ngAfterViewInit');
  }
}
