import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { BsModalRef, BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap';
import { BankList } from './bank-list';
import { SemesterFormatPipe } from '../../pipes/semester-format.pipe';
import { Payment } from '../../../data';
import { BasicService } from '../../../service';

@Component({
  selector: 'app-payment-form-modal',
  templateUrl: './payment-form-modal.component.html',
  styleUrls: ['./payment-form-modal.component.css'],
  providers: [
    SemesterFormatPipe,
  ],
})
export class PaymentFormModalComponent implements OnInit {
  public bankList = BankList;

  bsConfig: Partial<BsDatepickerConfig> = {
    showWeekNumbers: false,
    dateInputFormat: 'YYYY-MM-DD',
    containerClass: 'theme-blue',
  }

  modalMsgClass = '';
  modalMsgText = '';
  sendBtnDisabled = false;

  formErrors = {
    inputBankCode: '',
    inputDigitsAfter5Number: '',
    inputPaymentDate: '',
    inputPaymentAmount: '',
  };

  formValid = true;

  myPaymentModal: string;
  inputBankCode: string;
  inputDigitsAfter5Number: string;
  inputPaymentDate: string;
  inputPaymentAmount: number;
  inputDescription: string;
  paymentMessage: string;
  needSendMail = true;

  defPaymentAmount: number;
  checkedCourseList: Payment[] = [];

  get currLevel() {
    return this.basicSrv.currLevel;
  }

  get currSchoolYear() {
    return this.basicSrv.currSchoolYear;
  }

  get currSemester() {
    return this.basicSrv.currSemester;
  }

  get student() {
    return this.basicSrv.student;
  }

  @Input()
  set checkedCourses(courseList: Payment[]) {
    let defPaymentAmount = 0;
    for (const item of courseList) {
      try { defPaymentAmount += (+item.TuitionFees || 0); } catch (error) { }
      try { defPaymentAmount += (+item.Margin) || 0; } catch (error) {}
    }

    this.defPaymentAmount = defPaymentAmount;
    this.inputPaymentAmount = defPaymentAmount;
    this.checkedCourseList = courseList;
  };

  @Input()
  set lastBankCode(value: string) {
    this.inputBankCode = value;
  };

  @Input()
  set lastDigitsAfter5Number(value: string) {
    this.inputDigitsAfter5Number = value;
  }

  @Input() callback: Function;

  constructor(
    private basicSrv: BasicService,
    public modalRef: BsModalRef,
    public semesterFormatPipe: SemesterFormatPipe,
    private localeService: BsLocaleService,
  ) {
    this.localeService.use('zh-cn');
  }

  ngOnInit() {
    // 取得今天日期，為繳款日期的預設值
    this.inputPaymentDate = moment(new Date()).format('YYYY-MM-DD');
  }

  /**
   * 驗證資料
   * inputBankCode 不為空
   * inputDigitsAfter5Number 長度一定為 5 的數字
   * inputPaymentDate 日期可大於今天(預約轉帳)
   * inputPaymentAmount 金額不小於 0
   */
  async onSubmit() {
    if (this.sendBtnDisabled) return;

    const formErrors = {
      inputBankCode: '',
      inputDigitsAfter5Number: '',
      inputPaymentDate: '',
      inputPaymentAmount: '',
    };

    if (!this.inputBankCode) formErrors.inputBankCode = '必填！';
    if (this.inputDigitsAfter5Number.length != 5) {
      formErrors.inputDigitsAfter5Number = '請填入末5碼！';
    } else {
      if (!(/[0-9]{5}/.test(this.inputDigitsAfter5Number))) {
        formErrors.inputDigitsAfter5Number = '末5碼應為數字！';
      }
    }
    if (isNaN(Date.parse(this.inputPaymentDate))) {
      formErrors.inputPaymentDate = '日期不正確！';
    }
    if (!((/^(\+|-)?\d+$/.test('' + this.inputPaymentAmount)))) {
      if (+this.inputPaymentAmount < 0) formErrors.inputPaymentAmount = '請填入正整數！';
    }

    // 確認是否驗證成功
    const formValid = (
      !formErrors.inputBankCode
      && !formErrors.inputDigitsAfter5Number
      && !formErrors.inputPaymentDate
      && !formErrors.inputPaymentAmount);

    this.formErrors = formErrors;
    this.formValid = formValid;

    if (formValid) {
      // 儲存繳款單資訊
      if (['announcement', 'increment'].indexOf(this.currLevel) != -1) {
        try {
          this.sendBtnDisabled = true;

          const data = this.checkedCourseList.map(item => {
            return {
              Status: this.currLevel, // 執行階段，儲存要用的
              RefStudentSelectId: item.RefStudentSelectId,
              BankCode: this.inputBankCode,
              DigitsAfter5Number: this.inputDigitsAfter5Number,
              PaymentDate: this.inputPaymentDate,
              PaymentAmount: this.inputPaymentAmount,
              Description: this.inputDescription,
            }
          });
          // console.log(data);

          // 儲存
          const rsp = await this.setPaymentRecord(data);
          if (rsp) {
            // 寄信
            await this.sendMail();

            // 關閉視窗，呼叫 callback
            this.modalRef.hide();


            if (this.callback) this.callback();
          }
        } catch (error) {
          console.log(error);
        } finally {
          this.sendBtnDisabled = false;
        }
      }
    }
  }


  // 繳款單資訊寫入資料庫
  async setPaymentRecord(data) {
    try {
      const rsp = await this.basicSrv.setPaymentRecord(data);
      if (rsp.info === 'success') {

        const logMessage = {
          courseNames: [],
          refStudentSelectId: [],
          bankCode: '',
          digitsAfter5Number: '',
          paymentDate: '',
          paymentAmount: '',
          description: '',
        };

        logMessage.courseNames = this.checkedCourseList.map((item) => {
          return `
            *課程編號: ${item.NewSubjectCode}
            *課程名稱: ${item.CourseName}
            *學雜費: ${Number(item.TuitionFees).toLocaleString('en')}
            *保證金: ${Number(item.Margin).toLocaleString('en')}
          `
        });

        data.forEach((item) => {
          logMessage.refStudentSelectId.push(item.RefStudentSelectId);
          logMessage.bankCode = item.BankCode;
          logMessage.digitsAfter5Number = item.DigitsAfter5Number;
          logMessage.paymentDate = item.PaymentDate;
          logMessage.paymentAmount = item.PaymentAmount;
          logMessage.description = item.Description;
        });

        // 記錄 Log
        const logDescription = `
          校友「${this.student.StudentName}」填寫「校友選課保證金」。
          階段：${(this.currLevel === 'announcement' ? '正取公告中' : '遞補公告中')}
          課程清單：${logMessage.courseNames.join('---------')}
          選課系統編號：${logMessage.refStudentSelectId.join(',')}
          銀行代號：${this.inputBankCode}
          帳號末5碼：${this.inputDigitsAfter5Number}
          繳款時間：${this.inputPaymentDate}
          繳款金額：${+(this.inputPaymentAmount || 0).toLocaleString('en')}
          繳款說明：${this.inputDescription || '未填寫'}
          寄送副本：${(this.needSendMail) ? '是' : '否' }
          使用者電腦時間：${moment(new Date()).format('YYYY/MM/DD HH:mm:ss')}`;
        this.basicSrv.addLog('填寫「校友選課」保證金', '填寫「校友選課」保證金表單資料成功', logDescription);
        return true;
      } else {
        this.modalMsgClass = 'text-danger';
        this.modalMsgText = '儲存失敗！';
        return false;
      }
    } catch (error) {
      let tmp_msg = '';
      if (error.dsaError) {
        if (error.dsaError.status === '504') {
          switch (error.dsaError.message) {
            case '501':
              tmp_msg = '儲存失敗！現在非繳費期間。';
              break;
            default:
              tmp_msg = '發生錯誤！';
          }
        } else if (error.dsaError.message) {
          tmp_msg = error.dsaError.message;
        }
      } else if (error.loginError.message) {
        tmp_msg = error.loginError.message;
      } else if (error.message) {
        tmp_msg = error.message;
      }
      this.modalMsgClass = 'text-danger';
      this.modalMsgText = tmp_msg;
      return false;
    }
  }

  // 寄信
  async sendMail() {
    if (!this.needSendMail) return;
    if (!this.checkedCourseList.length) return;

    const receivers = [];
    [1,2,3,4,5].forEach((ii) => {
      if (this.student['Email' + ii]) {
        receivers.push(`${this.student.StudentName || ''}  <${this.student['Email' + ii]}>`);
      }
    });

    if (receivers.length) {
      const courseNames = this.checkedCourseList.map(item => item.CourseName);

      // 信件主旨
      const mailSubject = '校友選課匯款內容';
      // 信件內容
      const mailContent = `
        <p>
          同學，您好:<br />
          您於${this.currSchoolYear}學年度${this.semesterFormatPipe.transform(this.currSemester)} 校友選課匯款內容如下：
        </p>
        <p>
          課程名稱：${courseNames.join(', ')}<br />
          銀行代號：${this.inputBankCode}<br />
          帳號末5碼：${this.inputDigitsAfter5Number}<br />
          繳款時間：${this.inputPaymentDate}<br />
          繳款金額：${this.inputPaymentAmount}<br />
          繳款說明：${(this.inputDescription || '未填寫').replace(/\n/g, '<br />')}
        </p>
        <br /><br />
        <p>
          EMBA辦公室<br />
          02-3366-5409
        </p>
      `;

      try {
        await this.basicSrv.sendMail(receivers.join(','), mailSubject, mailContent);
        this.basicSrv.addLog(
          '填寫匯款通知',
          '發送「填寫匯款通知副本」成功',
          `校友「${this.student.StudentName}」發送「填寫匯款通知副本」成功`);
      } catch (error) {
        this.basicSrv.addLog(
          '填寫匯款通知',
          '發送「填寫匯款通知副本」失敗',
          `校友「${this.student.StudentName}」發送「填寫匯款通知副本」失敗： ${JSON.stringify(error)}`);
      }
    } else {
      this.basicSrv.addLog(
        '填寫匯款通知',
        '發送「填寫匯款通知副本」失敗',
        `校友「${this.student.StudentName}」未設定Email`);
    }
  }

}
