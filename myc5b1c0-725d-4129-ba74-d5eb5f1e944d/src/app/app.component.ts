import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { LoginService } from './core/login.service';
import { DsatestService } from './dsatest.service';
import { DSAService } from './dsutil-ng/dsa.service';
import { DSAError } from './dsutil-ng/errors';
import { Jsonx } from './dsutil-ng/jsonx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mycourse';

  constructor(
    private test: DsatestService,
    private login: LoginService
  ) {}

  async ngOnInit() {
    this.login.getMyInfo().subscribe(console.log);

    await this.test.getTimetable();
    await this.test.setTimetable();
  }

}
