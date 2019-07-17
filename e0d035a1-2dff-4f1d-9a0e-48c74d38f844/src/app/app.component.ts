import { Component,  OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { setTheme } from 'ngx-bootstrap/utils';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BasicService, TargetDataService } from './service';
import { ClassReocrd, CommentRecord, Configuration, StudentRecord, MoralityRecord, ModeRecord } from './data';
import { GadgetService } from './gadget.service';
import { BatchImportComponent } from './batch-import/batch-import.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {

  dispose$ = new Subject();

  isLoading = true;
  loadError = '';
  isMainLoading = false;
  loadMainError = '';
  isSaving = false;
  saveError = '';
  isOpening = false;
  canEdit = false;
  curMode: ModeRecord;
  modeList: ModeRecord[] = [];
  modalRef: BsModalRef;

  curClass: ClassReocrd = {} as ClassReocrd;
  classList: ClassReocrd[] = [];
  sysDateTime: moment.Moment;
  sysSchoolYear: string;
  sysSemester: string;
  curSchoolYear: string;
  schoolYearList: string[] = [];
  curSemester: string;
  moralList: CommentRecord[] = [];
  textScoreList: MoralityRecord[] = [];
  config: Configuration = {} as Configuration; // 開放輸入時間
  studentList: StudentRecord[] = [];
  hasChanged = false;

  constructor(
    private basicSrv: BasicService,
    private gadget: GadgetService,
    private modalService: BsModalService,
    private changeDetectorRef: ChangeDetectorRef,
    private targetDataSrv: TargetDataService,
  ) {
    setTheme('bs4');

    this.gadget.onLeave(() => {
      if (this.checkHasChanged()) {
        return '尚未儲存資料，現在離開視窗將不會儲存本次更動';
      }
      else {
        return '';
      }
    });
  }

  async ngOnInit() {
    try {
      this.targetDataSrv.student$.pipe(
        takeUntil(this.dispose$)
      ).subscribe(stu => {
        this.checkHasChanged();
      });

      this.isLoading = true;
      this.loadError = '';

      const rsp = await Promise.all([
        this.basicSrv.getCurrentDateTime(), // 0 主機時間
        this.basicSrv.getCurrentSemester(), // 1 目前學年期
        this.basicSrv.getTextScoreMappingTable(), // 2 取得文字評量代碼表(主項目>代碼 + 文字評量) 對應 mode = 文字評語
        this.basicSrv.getMoralCommentMappingTable(), // 3 德行評語代碼表(評語代碼 + 評語內容) 對應 mode = 成績評量
        this.basicSrv.getMoralUploadConfig(), // 4 開放期間等設定值
        this.basicSrv.getClass() // 5 班級清單
      ]);
      this.sysSchoolYear = rsp[1].curSchoolYear;
      this.sysSemester = rsp[1].curSemester;
      this.curSchoolYear = rsp[1].curSchoolYear;
      this.curSemester = rsp[1].curSemester;
      this.textScoreList = rsp[2];
      this.moralList = rsp[3];
      this.config.StartTime = (rsp[4].StartTime) ? moment(new Date(rsp[4].StartTime)).format('YYYY-MM-DD HH:mm') : null;
      this.config.EndTime = (rsp[4].EndTime) ? moment(new Date(rsp[4].EndTime)).format('YYYY-MM-DD HH:mm') : null;
      if (rsp[4].StartTime && rsp[4].EndTime) {
        if (new Date(rsp[4].StartTime) <= new Date(rsp[0]) && new Date(rsp[4].EndTime) >= new Date(rsp[0])) {
          this.isOpening = true;
          this.canEdit = true;
        }
      }
      this.classList = rsp[5];
      this.curClass = (rsp[5].length) ? rsp[5][0] : {};

      // 建立學年度清單
      for (let ii = 0; ii <= 5; ii ++) {
        this.schoolYearList.push(((parseInt(this.sysSchoolYear, 10) - ii)).toString());
      }

      // 處理評分項目，並下載學生成績
      const gradeItemList = this.textScoreList.map(item => item.Face);
      this.modeList.push({ Title: '文字評語', GradeItemList: gradeItemList});
      this.modeList.push({ Title: '成績評量', GradeItemList: ['評語']});
      await this.setCurrentModel(this.modeList[0]);

      // 指定第一個學生的第一項成績
      this.targetDataSrv.setStudent(this.studentList[0]);
      this.targetDataSrv.setGrade(this.curMode.GradeItemList[0]);

    } catch (error) {
      console.log(error);
      this.loadError = '發生錯誤！';
    } finally {
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.dispose$.next();
  }

  /**確認是否可編輯 */
  checkCanEdit() {
    let ret = false;
    if (this.sysSchoolYear === this.curSchoolYear && this.sysSemester === this.curSemester) {
      if (this.isOpening) {
        ret = true;
      }
    }
    this.canEdit = ret;
    this.targetDataSrv.setCanEdit(ret);
  }

  /**切換各式狀態前，異動檢查及詢問是否放棄變更 */
  async confirmDiscardChangedAndReload(callback: () => void) {
    if (this.checkHasChanged()) {
      if (!window.confirm('警告:尚未儲存資料，現在離開視窗將不會儲存本次更動')) {
        return false;
      }
    }
    callback();
    await this.getScore();
    this.checkCanEdit();
    this.hasChanged = false;
  }

  /**切換學年度 */
  async setSchoolYear(item: string) {
    await this.confirmDiscardChangedAndReload(() => this.curSchoolYear = item);
  }

  /**切換學期 */
  async setSemester(item: string) {
    await this.confirmDiscardChangedAndReload(() => this.curSemester = item);
  }

  /**切換班級 */
  async setCurrentClass(item: ClassReocrd) {
    await this.confirmDiscardChangedAndReload(() => this.curClass = item);
  }

  /**切換主要評分項目 */
  async setCurrentModel(item: ModeRecord) {
    await this.confirmDiscardChangedAndReload(() => {
      this.curMode = item;
      this.targetDataSrv.setMode(item);
    });
  }

  /**下載學生成績 */
  async getScore() {
    try {
      this.isMainLoading = true;
      this.loadMainError = '';
      this.studentList = await this.basicSrv.getStudentScore(this.curClass.ClassID, this.curSchoolYear, this.curSemester);
      this.targetDataSrv.setStudentList(this.studentList);
      // console.log(this.studentList);
    } catch (error) {
      console.log(error);
      this.loadMainError = '發生錯誤！';
    } finally {
      this.isMainLoading = false;
    }
  }

  /**檢查資料是否更動 */
  checkHasChanged() {
    let hasChanged = false;

    if (this.curMode && this.studentList.length) {
      if (this.curMode.Title === '文字評語') {
        for (const stu of this.studentList) {
          for (const v of [...stu.MoralityMapping.values()]) {
            if ((v.Origin || '') != (v.Text || '')) {
              hasChanged = true;
              break;
            }
          }
          if (hasChanged) { break; }
        }
      } else if (this.curMode.Title === '成績評量') {
        hasChanged = (this.studentList.find(stu => (stu.Comment || '') != (stu.Origin_Comment || ''))) ? true : false;
      }
    }
    this.hasChanged = hasChanged;
    return hasChanged;
  }

  /**儲存成績 */
  async save() {
    try {
      if (this.isSaving) { return; }
      this.isSaving = true;

      const content = [];
      this.studentList.forEach(stu => {
        if (this.curMode.Title === '文字評語') {
          const moralitys = [];
          stu.MoralityMapping.forEach(v => {
            moralitys.push({
              '@': ['Face'],
              Face: v.Face,
              '@text': (v.Text || '').replace(/\'/g, '\'\''), // 將單引號變更為兩個單引號，否則 sql 會出錯
            });
          });
          content.push({
            '@': ['StudentID'],
            StudentID: stu.StudentID,
            TextScore: {
              Content: {
                Morality: moralitys
              }
            }
          });
        } else if (this.curMode.Title === '成績評量') {
          content.push({
            '@': ['StudentID'],
            StudentID: stu.StudentID,
            Difference: stu.Difference,
            Comment: (stu.Comment || '').replace(/\'/g, '\'\''), // 將單引號變更為兩個單引號，否則 sql 會出錯
          });
        }
      });
      // console.log(content);
      await this.basicSrv.saveTextSupervised({SupervisedDiff: content});
      await this.getScore();
    } catch (error) {
      this.saveError = '儲存失敗！';
      alert(this.saveError);
    } finally {
      this.isSaving = false;
    }
  }

  /**開啟匯入視窗 */
  openBatchImport(face: string) {
    const config = {
      class: 'modal-lg',
      initialState: {
        data: {
          title: face,
          studentList: this.studentList,
        },
        callback: (data: any) => {
          // console.log(data);
          if (this.canEdit) {
            if (this.curMode.Title === '文字評語') {
              this.studentList.forEach((stu, idx) => {
                stu.MoralityMapping.forEach(v => {
                  if (v.Face === face) {
                    v.Text = data[idx];
                  }
                });
              });
            } else if (this.curMode.Title === '成績評量') {
              this.studentList.forEach((stu, idx) => {
                stu.Comment = data[idx];
              });
            }
            this.targetDataSrv.setStudentList(this.studentList);
            this.changeDetectorRef.detectChanges();
            this.checkHasChanged();
          }

          this.modalRef.hide();
        }
      }
    };
    this.modalRef = this.modalService.show(BatchImportComponent, config);
  }

  /**匯出 Excel */
  exportExcel() {
    // 檢查資料是否尚未儲存
    if (this.checkHasChanged()) {
      alert('資料尚未儲存，無法匯出。');
    } else {
      // 以 html 的 table 製作 excel 格式
      // 將 table 組裝成一個 xls 格式的字串
      // 以 Blob 物件製作成一個 xls 的檔案
      // 產出 a 標籤的 donwload 屬性建立檔名，並下載
      const title = `${this.curClass.ClassName}_德行成績`;
      const data = this.makeOutputData(title);
      const aLink = document.createElement('a');
      const encodedData = window.btoa(unescape(encodeURIComponent(data)));
      aLink.setAttribute('href', `data:application/vnd.ms-excel;base64,${encodedData}`);
      aLink.setAttribute('download', `${title}.xls`);
      aLink.click();
    }
  }

  /**製作匯出檔案內容 */
  makeOutputData(title: string) {
    // 檢查資料是否尚未儲存
    if (this.checkHasChanged()) {
      alert('資料尚未儲存，無法匯出。');
    } else {
      let header: string = '<td>座號</td><td>姓名</td>';
      let body: string = '';

      this.studentList.forEach((stu, idx) => {
        body += `<tr>`;
        body += `<td>${stu.SeatNumber}</td><td>${stu.Name}</td>`;

        if (this.curMode.Title === '文字評語') {
          stu.MoralityMapping.forEach(v => {
            if (idx === 0) { header += `<td>${v.Face}</td>`; }
            body += `<td>${v.Text || ''}</td>`;
          });
        } else if (this.curMode.Title === '成績評量') {
          if (idx === 0)  { header += `<td>評語</td>`; }
          body += `<td>${stu.Comment || ''}</td>`;
        }

        body += `</tr>`;
      });

      header = `<tr>${header}</tr>`;

      return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
          <head>
            <meta http-equiv="content-type" content="text/html; charset=UTF-8">
            <!--[if gte mso 9]>
            <xml>
              <x:ExcelWorkbook>
                <x:ExcelWorksheets>
                  <x:ExcelWorksheet>
                    <x:Name>${title}</x:Name>
                    <x:WorksheetOptions>
                      <x:DisplayGridlines/>
                    </x:WorksheetOptions>
                  </x:ExcelWorksheet>
                </x:ExcelWorksheets>
              </x:ExcelWorkbook>
            </xml>
            <![endif]-->
          </head>
          <body>
            <table border="1" cellspacing="0" cellpadding="2">
              <tbody>${title}${header}${body}</tbody>
            </table>
            <br/>教師簽名：
          </body>
        </html>`;
    }
  }
}
