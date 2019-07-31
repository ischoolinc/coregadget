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

  paymentList: Payment[] = [];
  checkedCourses: Payment[] = [];
  lastBankCode: string;
  lastDigitsAfter5Number: string;
  lastIsInvoice: boolean;
  lastInvoiceTitle: string;
  lastUniformNumbers: string;
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
  get student() {
    return this.basicSrv.student;
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
      const paymentList = []; // 全部正備取課程
      const checkedCourses1 = []; // 正取，排除淘汰 Cancel、及已入帳 VerifyAccounting、及繳費期間 Status，可勾選清單
      const checkedCourses2 = []; // 備取，排除淘汰 Cancel、及已入帳 VerifyAccounting、及繳費期間 Status，可勾選清單

      for (const elective of rsp) {
        if (this.allCourse.has(elective.AlumniID)) {
          const repo = this.allCourse.get(elective.AlumniID)

          elective.NewSubjectCode = repo.NewSubjectCode;
          elective.CourseName = repo.CourseName;
          elective.TuitionFees = repo.TuitionFees;
          elective.Margin = repo.Margin;
          elective.Checked = false;
          elective.IsDisabled = true;
          elective.IsVisible = false;

          // IsAdmitted == 't' 正取, 否則為備取
          if (elective.IsAdmitted === 't' && elective.Status === 'announcement') {
            elective.IsVisible = true;
            if (elective.Cancel !== 't' &&  elective.VerifyAccounting !== 't') {
              elective.Checked = true;
              elective.IsDisabled = false;
              checkedCourses1.push(elective);
            }
          } else if (elective.IsAdmitted !== 't' && elective.Status === 'increment') {
            elective.IsVisible = true;
            if (elective.Cancel !== 't' &&  elective.VerifyAccounting !== 't') {
              elective.Checked = true;
              elective.IsDisabled = false;
              checkedCourses2.push(elective);
            }
          }

          paymentList.push(elective);
        }
      }

      this.paymentList = paymentList;
      this.checkedCourses = [].concat(checkedCourses1, checkedCourses2);
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
