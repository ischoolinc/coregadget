import { Component, OnInit } from "@angular/core";
import { DsaTransferService } from "../../service/dsa-transfer.service";
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
      const outCancelResult = await this.dsaService.accessPointSend({
        dsns: this.regData.DSNS,
        contractName:  '1campus.counsel.transfer_out',
        securityTokenType: 'Basic',
        serviceName: 'CancelRegTransStudent',
        BasicValue: { UserName: `${this.regData.TransferToken}-`, Password: '1234' },
        body: `<Request>
            <TransferToken>${this.regData.TransferToken}</TransferToken>
            <RadPointCode>轉出核可</RadPointCode>
          </Request>
        `,
        rootNote: 'Info'
      });
      if (outCancelResult === 'success') {
        const cancelResult = await this.dsaService.send('TransferStudent.CancelTransInStudent', {
          Uid: this.regData.Uid,
        });
        if (cancelResult.Info === 'success') {
          $('#cancelTransStudentModal').modal('hide');
        } else {
          this.cancelRegStatus = {
            info: 'failed',
            msg: '取消失敗'
          };
        }
      } else {
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
