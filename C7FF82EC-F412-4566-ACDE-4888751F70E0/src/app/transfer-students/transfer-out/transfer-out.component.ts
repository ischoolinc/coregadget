import { Component, OnInit, ViewChild } from '@angular/core';
import { DsaService } from 'src/app/dsa.service';
import { CheckTransferOutModalComponent } from './check-transfer-out-modal/check-transfer-out-modal.component';
@Component({
  selector: 'app-transfer-out',
  templateUrl: './transfer-out.component.html',
  styleUrls: ['./transfer-out.component.css']
})
export class TransferOutComponent implements OnInit {

  isLoading = true;
  transList: TransStudentRec[] = [];
  targetStudent: TransStudentRec = {} as TransStudentRec;
  isSaving = false;

  @ViewChild("case_modal") case_modal: CheckTransferOutModalComponent;

  constructor(
    private dsaService: DsaService,
  ) { }

  async ngOnInit() {
    try {
      await this.getList();
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }

  async getList() {
    // let resp = await this.dsaService.send("TransferStudent.GetTransInStudents");
    // this.transList = [].concat(resp.StudentList || []);
    this.transList = [
      {
        student_id: '1',
        student_name: '林木韻',
        seat_no: '6',
        class_name: '201',
        dsns: '建華國中',
        transfer_token: '',
        accept_token: '',
        contract_info: '',
        create_time: new Date('2022-09-19 10:45:00').toString(),
        approved_time: '',
        remark: '',
        log: '',
        status: '1',
        creater: '李玉玲',
        id_number: 'A123456789'
      }
    ];
  }

  formatStatus(status: string) {
    switch (status) {
      case '0':
        return '未申請';
      case '1':
        return '待確認';
      case '2':
        return '已確認';
      case '3':
        return '已完成';
      case '-1':
        return '取消';
    }
  }

  async toReg(item: TransStudentRec) {
    item.status = '1';
    item.create_time = new Date().toString();
  }

  async cancelReg(item: TransStudentRec) {
    item.status = '-1';
  }

  async confrimTransIn(item: TransStudentRec) {
    this.targetStudent = item;
    $('#confirmTransModal').modal('show');
  }

  async beginTransIn() {
    if (this.isSaving) return;

    this.isSaving = true;

    setTimeout(() => {
      this.targetStudent.status = '3';
      this.isSaving = false;
      $('#confirmTransModal').modal('hide');
    }, 3000);
  }

  devSetApproved(item: TransStudentRec) {
    item.status = '2';
    item.approved_time = new Date().toString();
  }

  openReg() {
    $("#newCase").modal({backdrop:'static'});
    $("#newCase").modal("show");
    // 關閉畫面
    $("#newCase").on("hide.bs.modal", () => {
      // 重整資料
      // if (!this.case_modal.isCancel){
      //   // this.loadData();
      // }
      $("#newCase").off("hide.bs.modal");
    });
  }
}

interface TransStudentRec {
  student_id: string;
  student_name: string;
  seat_no: string;
  class_name: string;
  dsns: string;
  transfer_token: string;
  accept_token: string;
  contract_info: string;
  create_time: string;
  approved_time: string;
  remark: string;
  log: string;
  status: string;
  creater: string;
  id_number: string;
}
