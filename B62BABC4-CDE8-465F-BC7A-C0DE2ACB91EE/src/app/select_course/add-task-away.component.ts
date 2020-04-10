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

  isLoading: boolean = true;
  // 課程時段
  subjectType: string;
  // 選課清單
  subjectList: SubjectRecord[] = [];
  // 學生選課資料
  stuAttend: AttendRecord;
  // 學生目前修課資料
  stuAttendList: AttendRecord[] = [];

  selectedSubject: SubjectRecord;

  dialogConfirm: MatDialogRef<any>;

  @ViewChild('tplAddConfirm') tplAddConfirm: TemplateRef<any>;
  @ViewChild('tplCancelConfirm') tplCancelConfirm: TemplateRef<any>;

  constructor (
    private route: ActivatedRoute, 
    private basicSrv: BasicService,
    private dialog: MatDialog,
  ) { }
  
  async ngOnInit() {
    try {
      this.isLoading = true;
      // 取得課程時段
      this.subjectType = this.route.snapshot.paramMap.get('subjectType');
      await this.getData();
    } catch(err) {
      alert('GetSubjectList error:\n' + JSON.stringify(err));
      console.log(err);
    } finally {
      this.isLoading = false;
    }
  }

  /**取得該課程時段選課資料 */
  async getData() {
    const rsp = await this.basicSrv.getSubjectListByType({ SubjectType: this.subjectType });
    this.subjectList = rsp.SubjectList;
    this.stuAttend = rsp.Attend;
  }

  /** 加選確認 */
  confirmJoinCourse(subject: SubjectRecord) {

    this.selectedSubject = subject;

    if (this.stuAttend) {

      this.dialogConfirm = this.dialog.open(this.tplAddConfirm, {
        width: '450px'
      });

      this.dialogConfirm.afterClosed().subscribe((v) => {
        if (v && v.subject) {
          this.joinCourse(subject);
        }
      });

    } else {
      this.joinCourse(subject);
    }
  }

  /** 加選 */
  async joinCourse(subject: SubjectRecord) {
    this.isLoading = true;
    const rsp = await this.basicSrv.setTakeAway({ SubjectType: this.subjectType, SubjectID: subject.SubjectID });
    if (rsp.status === 'success') {
      // 重新取得資料
      await this.getData();
    } else {
      alert(`SetTakeAway error:\n ${rsp.message}`);
    }
    this.isLoading = false;
  }

  /** 顯示科目資訊 */
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

  /** 退選確認畫面 */
  openCancelConfirmDialog() {
    this.dialogConfirm = this.dialog.open(this.tplCancelConfirm, {
      width: '450px'
    });
  }

  /** 退選 */
  async leaveCourse(subject: AttendRecord){
    this.isLoading = true;
    const rsp = await this.basicSrv.leaveTakeAway({ SubjectID: subject.SubjectID });
    if (rsp.status === 'success') {
      // 重新取得資料
      this.getData();
      // 關閉退選確認畫面
      this.dialogConfirm.close();
    } else {
      alert(`LeaveTakeAway error:\n ${rsp.message}`);
    }
    this.isLoading = false;
  }
  
}
