import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { LoginService } from './core/login.service';
import { TimetableService } from './core/timetable.service';
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
    private timetable: TimetableService,
    private login: LoginService
  ) {}

  async ngOnInit() {
    this.login.getMyInfo().subscribe(console.log);
    this.login.getSelectedContext().subscribe(console.log);

    const rsp1 = await this.timetable.getTimetable('dev.sh_d');

    const rsp2 = await this.timetable.setTimetable('dev.sh_d', {
      "course_id": "11729",
      "period": [
        {
          "weekday": "1",
          "period": "1"
        },
        {
          "weekday": "1",
          "period": "2"
        }
      ]
    });

    console.log(rsp1);
  }

}
