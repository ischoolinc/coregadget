import { Component, Input, OnInit } from '@angular/core';
import { MyCourseRec } from '../core/data/my-course';
import { GoogleClassroomService } from '../core/google-classroom.service';

@Component({
  selector: 'app-edit-google-classroom',
  templateUrl: './edit-google-classroom.component.html',
  styleUrls: ['./edit-google-classroom.component.scss']
})
export class EditGoogleClassroomComponent implements OnInit {

  dislinkingGoogle = false;
  processState = 101;
  processErrorMsg = '';

  @Input() adminIsConnectedGoogle = false;
  @Input() dsns = '';
  @Input() data: { target: MyCourseRec } = { target: {} as MyCourseRec };

  constructor(
    private gClassroomSrv: GoogleClassroomService,
  ) { }

  ngOnInit(): void {
  }

  async dislinkGoogleClassroom() {
    if (!this.adminIsConnectedGoogle) { return; }
    if (this.dislinkingGoogle) { return; }

    const { GoogleExt } = this.data.target;

    try {
      this.dislinkingGoogle = true;
      const rsp = await this.gClassroomSrv.delCourseAlias(this.dsns,
        'google_classroom_admin',
        GoogleExt?.id || '',
        this.data.target.Alias || '');

      console.log(rsp);
      this.data.target.GoogleExt = undefined;
      this.processState = 2000;
    } catch(err) {
      console.error(err);
      this.processState = 9999;
    } finally {
      this.dislinkingGoogle = false;
    }
  }
}
