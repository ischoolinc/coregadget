import { Component, Input, OnInit } from '@angular/core';
import { MyCourseRec } from '../core/data/my-course';
import { GoogleClassroomService } from '../core/google-classroom.service';

@Component({
  selector: 'app-launcher-google-classroom',
  templateUrl: './launcher-google-classroom.component.html',
  styleUrls: ['./launcher-google-classroom.component.scss']
})
export class LauncherGoogleClassroomComponent implements OnInit {

  @Input() course: MyCourseRec = {} as MyCourseRec;

  constructor(
    private gClassroomSrv: GoogleClassroomService,
  ) { }

  ngOnInit(): void {
  }

  googleSigninChooserUrl(url: string = '') {
    return this.gClassroomSrv.getGoogleSigninChooserUrl(url);
  }
}
