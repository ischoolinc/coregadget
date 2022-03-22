import { Component, Input, OnInit } from '@angular/core';
import { MyCourseRec } from '../core/data/my-course';
import { LoginService } from '../core/login.service';

@Component({
  selector: 'app-launcher-oha',
  templateUrl: './launcher-oha.component.html',
  styleUrls: ['./launcher-oha.component.scss']
})
export class LauncherOhaComponent implements OnInit {

  @Input() dsns = '';
  @Input() roleName = '';
  @Input() course: MyCourseRec = {} as MyCourseRec;

  // 改成「https://us-central1-classroom-1campus.cloudfunctions.net/ohaSSOUri」試試...
  #classroom_url = 'https://oha.1campus.net';

  constructor(
    private login: LoginService,
  ) { }

  ngOnInit(): void {
  }

  classroomUrl(course: MyCourseRec) {
    const target = `${this.#classroom_url}?dsns=${this.dsns}&type=course&uid=${course.CourseId}&role=${this.roleName}`;
    return this.login.getLinkout(target);
  }

}
