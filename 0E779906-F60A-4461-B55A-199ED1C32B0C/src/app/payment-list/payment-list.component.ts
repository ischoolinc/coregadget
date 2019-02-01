import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ViewportScroller } from '@angular/common';
import { AppComponent } from '../app.component';
import { Payment } from '../data/payment';
import { BasicService } from '../service';
import { PaymentFormModalComponent } from '../shared/component/payment-form-modal/payment-form-modal.component';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent implements OnInit {

  loadState: 'finish' | 'loading' | 'error' = 'loading';
  modalRef: BsModalRef;

  admitteds: Payment[] = [];
  waitings: Payment[] = [];
  checkedCourses: Payment[] = [];
  lastBankCode: string;
  lastDigitsAfter5Number: string;
  showModal = false;

  get currSchoolYear() {
    return this.basicSrv.currSchoolYear;
  }
  get currSemester() {
    return this.basicSrv.currSemester;
  }
  get allCourse() {
    return this.basicSrv.allCourse;
  }
  get currLevel() {
    return this.basicSrv.currLevel;
  }
  get student() {
    return this.basicSrv.student;
  }
  get openingDate() {
    return this.basicSrv.openingDate;
  }
  get configuration() {
    return this.basicSrv.configuration;
  }

  constructor(
    private basicSrv: BasicService,
    private modalService: BsModalService,
    private appComponent: AppComponent,
    private viewportScroller: ViewportScroller,
  ) {}

  ngOnInit() {
    this.getMyPaymentList();
  }

  /**保證金清單 */
  async getMyPaymentList() {
    try {
      const rsp: Payment[] = await this.basicSrv.getMyPaymentList(this.currSchoolYear, this.currSemester);

      // 整理繳款單及正備取遞補課程名單
      const data1 = []; // 全部正取課程
      const data2 = []; // 全部備取課程
      let checkedCourses = []; // 依階段，正取或遞補的打勾清單，排除淘汰 Cancel、及 VerifyAccounting 已入帳可勾選清單
      const checkedCourses1 = []; // 正取排除淘汰 Cancel、及 VerifyAccounting 已入帳可勾選清單
      const checkedCourses2 = []; // 正取排除淘汰 Cancel、及 VerifyAccounting 已入帳可勾選清單
      let lastBankCode = '';
      let lastDigitsAfter5Number = '';

      for (const elective of rsp) {
        if (this.allCourse.has(elective.AlumniID)) {
          const repo = this.allCourse.get(elective.AlumniID)

          elective.NewSubjectCode = repo.NewSubjectCode;
          elective.CourseName = repo.CourseName;
          elective.TuitionFees = repo.TuitionFees;
          elective.Margin = repo.Margin;
          elective.Checked = (elective.Cancel === 't' || elective.VerifyAccounting === 't') ? false : true;

          // IsAdmitted == 't' 正取, 否則為備取
          if (elective.IsAdmitted === 't') {
            data1.push(elective);
            if (elective.Cancel !== 't' &&  elective.VerifyAccounting !== 't') checkedCourses1.push(elective);
          } else {
            data2.push(elective);
            if (elective.Cancel !== 't' && elective.VerifyAccounting !== 't') checkedCourses2.push(elective);
          };

          // 取得銀行帳戶最後記錄
          if (elective.BankCode) {
            lastBankCode = elective.BankCode;
            lastDigitsAfter5Number = elective.DigitsAfter5Number;
          }
        }
      }

      if (this.currLevel == 'announcement') checkedCourses = checkedCourses1;
      if (this.currLevel == 'increment') checkedCourses = checkedCourses2;

      this.admitteds = data1;
      this.waitings = data2;
      this.checkedCourses = checkedCourses;
      this.lastBankCode = lastBankCode;
      this.lastDigitsAfter5Number = lastDigitsAfter5Number;
      this.loadState = 'finish';
    } catch (error) {
      this.loadState = 'error';
    }
  }

  // 顯示填表 modal
  handleShowModal() {
    if (!this.checkedCourses.length) return;

    // 開啟 modal
    const config = {
      initialState: {
        checkedCourses: this.checkedCourses,
        lastBankCode: this.lastBankCode,
        lastDigitsAfter5Number: this.lastDigitsAfter5Number,
        callback: () => {
          this.viewportScroller.scrollToPosition([0, 0]);
          this.appComponent.mainMsgClass = 'alert alert-success';
          this.appComponent.mainMsgText = '儲存成功！';
          setTimeout(() => {
            this.appComponent.mainMsgClass = '';
            this.appComponent.mainMsgText = '';
          }, 5000);

          // 重讀保證金清單
          this.getMyPaymentList();
        }
      }
    };
    this.modalRef = this.modalService.show(PaymentFormModalComponent, Object.assign({}, config));
  }

  // 設定勾選
  handleInputChange(checkedCourses: Payment[]) {
    this.checkedCourses = checkedCourses;
  }
}
