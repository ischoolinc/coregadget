import { Component, OnInit, ViewChild } from '@angular/core';
import { DsaService } from 'src/app/dsa.service';
import { RegTransferInModalComponent } from './reg-transfer-in-modal/reg-transfer-in-modal.component';

@Component({
  selector: 'app-transfer-in',
  templateUrl: './transfer-in.component.html',
  styleUrls: ['./transfer-in.component.css']
})
export class TransferInComponent implements OnInit {

  isLoading = true;
  transList: TransStudentRec[] = [];
  targetStudent: TransStudentRec = {} as TransStudentRec;
  isSaving = false;

  @ViewChild('abc') regTransferInModalComponent: RegTransferInModalComponent;


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
    let resp = await this.dsaService.send("TransferStudent.GetTransInStudents");
    this.transList = [].concat(resp.StudentList || []);
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
      case '-2':
        return '拒絕';
    }
  }

  async toReg(item: TransStudentRec) {
    item.Status = '1';
    item.CreateTime = new Date().toString();
  }

  async cancelReg(item: TransStudentRec) {
    item.Status = '-1';
  }

  async confrimTransIn(item: TransStudentRec) {
    this.targetStudent = item;
    $('#confirmTransModal').modal('show');
  }

  async beginTransIn() {
    if (this.isSaving) return;

    this.isSaving = true;

    setTimeout(() => {
      this.targetStudent.Status = '3';
      this.isSaving = false;
      $('#confirmTransModal').modal('hide');
    }, 3000);
  }

  devSetApproved(item: TransStudentRec) {
    item.Status = '2';
    item.ApprovedTime = new Date().toString();
  }

  openReg() {
    $('#regTransStudentModal').modal({ backdrop:'static' });
    $('#regTransStudentModal').modal('show');
    $("#regTransStudentModal").on("hide.bs.modal", () => {
      // 重整資料
      // if (!this.case_modal.isCancel){
      //   // this.loadData();
      // }
      $("#regTransStudentModal").off("hide.bs.modal");
    });
  }

  confirmCancelReg() {
    $('#confirmTransModal').modal('show');
  }

  beginCancelReg() {

  }
}

interface TransStudentRec {
  StudentId: string;
  StudentName: string;
  SeatNo: string;
  ClassName: string;
  Uid: string;
  DSNS: string;
  TransferToken: string;
  AcceptToken: string;
  ContractInfo: string;
  CreateTime: string;
  ApprovedTime: string;
  Status: string;
  Remark: string;
  CancelTime: string;
  TeacherName: string;
  Nickname: string;
}
