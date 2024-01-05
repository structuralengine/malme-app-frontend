import { Component } from '@angular/core';
import { FooterService } from '../service/footer.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor(public footer: FooterService) {}
}
