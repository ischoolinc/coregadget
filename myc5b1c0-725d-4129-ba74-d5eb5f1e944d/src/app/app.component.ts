import { Component, OnInit } from '@angular/core';
import { LoginService } from './core/login.service';
import { TimetableService } from './core/timetable.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  table_row = [...Array(3).keys()];

  constructor(
    private timetable: TimetableService,
    private login: LoginService
    // private dialog: MatDialog,
  ) {}

  async ngOnInit() {
    this.login.getMyInfo().subscribe(console.log);
    this.login.getSelectedContext().subscribe(console.log);

    const rsp1 = await this.timetable.getTimetable('dev.sh_d');

    const rsp2 = await this.timetable.setTimetable('dev.sh_d', {
      "course_id": "11729",
      "periods": [
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
