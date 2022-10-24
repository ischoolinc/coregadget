import { Component, OnInit } from "@angular/core";
import { DsaTransferService } from "../../service/dsa-transfer.service";
import { TransferStudentsService } from "../../service/transfer-students.service";
import { TransStudentRec } from "../transfer-in.component";

@Component({
  selector: "app-cancel-transfer-in-modal",
  templateUrl: "./cancel-transfer-in-modal.component.html",
  styleUrls: ["./cancel-transfer-in-modal.component.css"]
})
export class CancelTransferInModalComponent implements OnInit {

  isSetting = false;
  cancelRegStatus: CancelRegStatus = {} as CancelRegStatus;
  regData: TransStudentRec = {} as TransStudentRec;

  constructor(
    private dsaService: DsaTransferService,
    private transferSrv: TransferStudentsService
  ) { }

  ngOnInit() {
  }

  loadDefault(item: TransStudentRec) {
    this.isSetting = false;
    this.regData = item;
    this.cancelRegStatus = {} as CancelRegStatus;
  }

  async beginCancel() {
    if (this.isSetting) return;

    try {
      this.isSetting = true;
      this.cancelRegStatus = { info: '', msg: '' };

      const outCancelBody = `<Request>
          <TransferToken>${this.regData.TransferToken}</TransferToken>
          <RedPointCode>轉出核可</RedPointCode>
        </Request>
      `;

      const outCancelResult = await this.dsaService.accessPointSend({
        dsns: this.regData.DSNS,
        contractName:  '1campus.counsel.transfer_out',
        securityTokenType: 'Basic',
        serviceName: 'CancelRegTransStudent',
        BasicValue: { UserName: `${this.regData.TransferToken}-`, Password: '1234' },
        body: outCancelBody,
        rootNote: 'Info'
      });
      if (outCancelResult === 'success') {
        try {
          await this.transferSrv.addLog('取消申請', '向轉出校取消',
            `成功。StudentId：${this.regData.StudentId}。TransInID：${this.regData.Uid}`,
            outCancelBody);
        } catch (error) {
          console.log(error);
        }

        const inCancelBody = {
          Uid: this.regData.Uid,
        };

        const cancelResult = await this.dsaService.send('TransferStudent.CancelTransInStudent', inCancelBody);
        if (cancelResult.Info === 'success') {
          try {
            await this.transferSrv.addLog('取消申請', '本校取消',
              `成功。StudentId：${this.regData.StudentId}。TransInID：${this.regData.Uid}`,
              JSON.stringify(inCancelBody));
          } catch (error) {
            console.log(error);
          }

          $('#cancelTransStudentModal').modal('hide');
        } else {
          try {
            await this.transferSrv.addLog('取消申請', '本校取消',
              `失敗。StudentId：${this.regData.StudentId}。TransInID：${this.regData.Uid}`,
              JSON.stringify(inCancelBody));
          } catch (error) {
            console.log(error);
          }

          this.cancelRegStatus = {
            info: 'failed',
            msg: '取消失敗'
          };
        }
      } else {
        try {
          await this.transferSrv.addLog('取消申請', '向轉出校取消',
            `失敗。StudentId：${this.regData.StudentId}。TransInID：${this.regData.Uid}`,
            outCancelBody);
        } catch (error) {
          console.log(error);
        }

        this.cancelRegStatus = {
          info: 'failed',
          msg: '取消申請失敗'
        };
      }
    } catch (error) {
      this.cancelRegStatus = {
        info: 'failed',
        msg: '過程中發生錯誤'
      };
    } finally {
      this.isSetting = false;
    }
  }
}

interface CancelRegStatus {
  info: string;
  msg: string;
}
