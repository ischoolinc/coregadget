import { Component, OnInit } from '@angular/core';
import { SportService } from './service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {

  currentPage = '報名';
  loading = true;

  constructor(
    private sportSrv: SportService) {
  }

  async ngOnInit() {
    try {
      await this.sportSrv.getLoginInfo();
      await this.sportSrv.getActionEvents();
    } catch (error) {

    } finally {
      this.loading = false;
    }
  }

  toggle(tabName) {
    this.currentPage = tabName;
  }
}
