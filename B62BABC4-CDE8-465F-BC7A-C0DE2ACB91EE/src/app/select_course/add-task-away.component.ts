import { Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { BasicService } from '../service/basic.service';
import { AddDialogComponent } from './add-dialog.component';
import { SubjectRecord, AttendRecord } from '../data/index';

@Component({
  selector: 'app-add-task-away',
  templateUrl: './add-task-away.component.html',
  styles: []
})
export class AddTaskAwayComponent implements OnInit {

  loading: boolean = true;
  // 課程時段
  subjectType: string;
  // 選課清單
  subjectList: SubjectRecord[] = [];
  // 學生選課資料
  stuAttend: AttendRecord;
  // 學生目前修課資料
  stuAttendList: AttendRecord[] = [];

  dialogConfirm: MatDialogRef<any>;

  @ViewChild('tplConfirm') tplConfirm: TemplateRef<any>;

  constructor (
    private route: ActivatedRoute, 
    private basicSrv: BasicService,
    private dialog: MatDialog,
  ) { }
  
  async ngOnInit() {
    try {
      // 取得課程時段
      this.subjectType = this.route.snapshot.paramMap.get('subjectType');
      await this.getData();
    } catch(err) {
      alert('GetSubjectList error:\n' + JSON.stringify(err));
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  /**取得該課程時段選課資料 */
  async getData() {
    const rsp = await this.basicSrv.getSubjectListByType({ SubjectType: this.subjectType });
    this.subjectList = rsp.SubjectList;
    this.stuAttend = rsp.Attend;
  }

  /**加選 */
  async joinCourse(subject: SubjectRecord) {
    const rsp = await this.basicSrv.setTakeAway({ SubjectType: this.subjectType, SubjectID: subject.SubjectID });
    if (rsp.status === 'success') {
      // 重新取得資料
      await this.getData();
    } else {
      alert(`SetTakeAway error:\n ${rsp.message}`);
    }
  }

  /**退選 */
  async leaveCourse(subject: AttendRecord){
    const rsp = await this.basicSrv.leaveTakeAway({ SubjectID: subject.SubjectID });
    if (rsp.status === 'success') {
      // 重新取得資料
      this.getData();
      // 關閉退選確認畫面
      this.dialogConfirm.close();
    } else {
      alert(`LeaveTakeAway error:\n ${rsp.message}`);
    }
  }

  /**顯示科目資訊 */
  showDialog(subject: SubjectRecord, mode: string) {
    const dig = this.dialog.open(AddDialogComponent, {
      data: { subject: subject, mode: mode , countMode:'先搶先贏'}
    });

    dig.afterClosed().subscribe((v) => {
      if (v && v.subject) {
        this.joinCourse(v.subject);
      }
    });
  }

  /**退選確認畫面 */
  openConfirmDialog() {
    this.dialogConfirm = this.dialog.open(this.tplConfirm, {
      width: '450px'
    });
  }

}
