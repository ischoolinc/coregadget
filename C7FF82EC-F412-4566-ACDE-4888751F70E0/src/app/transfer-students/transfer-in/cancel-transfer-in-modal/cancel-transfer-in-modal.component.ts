import { Component, OnInit } from "@angular/core";
import { DsaService } from "src/app/dsa.service";

@Component({
  selector: "app-cancel-transfer-in-modal",
  templateUrl: "./cancel-transfer-in-modal.component.html",
  styleUrls: ["./cancel-transfer-in-modal.component.css"]
})
export class CancelTransferInModalComponent implements OnInit {

  isLoading = true;
  isReging = false;
  cancelRegStatus: CancelRegStatus = {} as CancelRegStatus;

  constructor(
    private dsaService: DsaService,
  ) { }

  async ngOnInit() {
    try {
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }

  cancel() {
    $("#regTransStudentModal").modal("hide");
  }

  async beginReg() {
    if (this.isReging) return;

    try {
      this.isReging = true;
      this.cancelRegStatus = { info: '', msg: '' };
      const resp = await this.dsaService.send('TransferStudent.GetMyInfo');
      const myInfo = resp.MyInfo || {};
      // TODO: 去它校申請轉入
      this.cancelRegStatus = { info: 'success', msg: '' };
    } catch (error) {
      this.cancelRegStatus = {
        info: 'failed',
        msg: '過程中發生錯誤'
      };
    } finally {
      this.isReging = false;
    }
  }
}

interface CancelRegStatus {
  info: string;
  msg: string;
}
