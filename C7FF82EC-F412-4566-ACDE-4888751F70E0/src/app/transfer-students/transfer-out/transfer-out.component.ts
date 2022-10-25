import { Component, OnInit, ViewChild } from '@angular/core';
import { DsaService } from 'src/app/dsa.service';
import { TransferStudentsService } from '../service/transfer-students.service';
import { CheckTransferOutModalComponent } from './check-transfer-out-modal/check-transfer-out-modal.component';
@Component({
  selector: 'app-transfer-out',
  templateUrl: './transfer-out.component.html',
  styleUrls: ['./transfer-out.component.css']
})
export class TransferOutComponent implements OnInit {

  isLoading = true;
  transList: TransOutStudentRec[] = [];
  targetStudent: TransOutStudentRec = {} as TransOutStudentRec;

  @ViewChild("checkTransferOutModal") checkTransferOutModalComponent: CheckTransferOutModalComponent;

  constructor(
    private dsaService: DsaService,
    public transferSrv: TransferStudentsService,
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
    let resp = await this.dsaService.send("TransferStudent.GetTransOutStudents");
    this.transList = [].concat(resp.StudentList || []);
  }

  formatStatus(status: string) {
    switch (status) {
      case '1':
        return '待核可';
      case '2':
        return '已核可';
      case '-1':
        return '取消申請';
      case '-2':
        return '已拒絕';
    }
  }

  confirmCheckModal(item: TransOutStudentRec) {
    this.checkTransferOutModalComponent.loadDefault(item);
    $('#checkTransferOutModal').modal('show');
    $("#checkTransferOutModal").on("hide.bs.modal", async () => {
      try {
        await this.getList();
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
      $("#checkTransferOutModal").off("hide.bs.modal");
    });
  }

  formatStudentStatus(status: string) {
    return this.transferSrv.formatStudentStatus(status);
  }
}

export interface TransOutStudentRec {
  StudentId: string;
  StudentName: string;
  SeatNo: string;
  Id_Number: string;
  StudentStatus: string;
  GradeYear: string;
  ClassName: string;
  Uid: string;
  DSNS: string;
  SchoolTitle: string;
  TransferToken: string;
  AcceptToken: string;
  ConnectionInfo: string;
  CreateTime: string;
  ApprovedTime: string;
  Status: string;
  Remark: string;
  CancelTime: string;
}
