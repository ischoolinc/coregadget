import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AddDialogComponent } from './add-dialog.component';
import { BasicInfo, SubjectRecord, SubjectTypeRecord} from '../data/index'
import { BasicService } from '../service/basic.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styles: []
})
export class MainComponent implements OnInit {
  loading: boolean = true;
  // 學生目前選課狀態
  basicInfo: BasicInfo;
  // 課程時段清單
  subjectTypeList: SubjectTypeRecord[] = [];

  Tooltip = '推算第一輪志願分發狀況\n 1. 自行評估選上的機率\n 2. 避免後面志願選填必定額滿的課程';

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private dialog: MatDialog,
    private basicSrv: BasicService) { }

  async ngOnInit() {
    try {
      await this.getData();
    } catch(err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  /**取得選課基本資料 */
  async getData() {
    this.basicInfo = await this.basicSrv.getCurrentStatus();
    this.subjectTypeList = this.basicInfo.SubjectTypeList;
  }

  /**可選課程時段 */
  getSelectableType(): string {
    const typeList: string[] = [];
      this.subjectTypeList.forEach((type: SubjectTypeRecord) => {
        if (type.IsOpenType === 't') {
          typeList.push(type.SubjectType);
        }
      });
      return typeList.join('、')
  }

  /**顯示選課科目資料 */
  showDialog(subject: SubjectRecord, mode: string) {
    this.dialog.open(AddDialogComponent, {
      width: '600px',
      data: { 
        subject: subject, 
        mode: mode
      }
    });
  }

  /**先搶先贏 */
  async selectTakeAwayCourse(subjectType: string) {
    // 將使用者所選課程傳入
    this.router.navigate(['../add-task-away', subjectType], {
      relativeTo: this.route
    });
  }

  /**志願序 */
  async selectWishCourse(subjectType: string) {
    // 將使用者所選課程傳入
    this.router.navigate(['../add-wish', subjectType], {
      relativeTo: this.route
    });
  }

}
