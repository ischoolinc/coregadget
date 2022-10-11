import { Component, OnInit } from "@angular/core";
import { DsaTransferService } from "../../service/dsa-transfer.service";
import { TransferStudentsService } from "../../service/transfer-students.service";
import { TransOutStudentRec } from "../transfer-out.component";
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: "app-check-transfer-out-modal",
  templateUrl: "./check-transfer-out-modal.component.html",
  styleUrls: ["./check-transfer-out-modal.component.css"]
})
export class CheckTransferOutModalComponent implements OnInit {

  isSetting = false;
  replyStatus: ReplyStatus = {} as ReplyStatus;
  studentData: TransOutStudentRec = {} as TransOutStudentRec;

  constructor(
    public dsaService: DsaTransferService,
    public transferSrv: TransferStudentsService,
  ) { }

  ngOnInit() {
  }

  loadDefault(item: TransOutStudentRec) {
    this.isSetting = false;
    this.studentData = item;
  }

  formatStudentStatus(status: string) {
    return this.transferSrv.formatStudentStatus(status);
  }

  async beginReply(pass: boolean) {
    try {
      this.isSetting = true;
      this.replyStatus = { info: '', msg: '' };

      const myDSNS = gadget.getApplication().accessPoint;
      const acceptToken = pass ? `${uuidv4().substring(0, 7)}@${myDSNS}` : null;
      // 1. 去它校回覆結果
      // 2. 在本校更新回覆記錄
      // 3. 新增 log TODO:
      const replyResult = await this.dsaService.accessPointSend({
        dsns: this.studentData.DSNS,
        contractName:  '1campus.counsel.transfer_in',
        securityTokenType: 'Basic',
        BasicValue: { UserName: this.studentData.TransferToken, Password: '1234' },
        serviceName: 'SetApprovedStatusAndRedPoint',
        body: `<Request>
          <AcceptToken>${acceptToken}</AcceptToken>
          <Pass>${pass}</Pass>
          <RadPointCode>轉入申請</RadPointCode>
        </Request>`,
        rootNote: 'Info'
      });

      if (replyResult === 'success') {
        const setResult = await this.dsaService.send('TransferStudent.SetApprovedStatus', {
          Uid: this.studentData.Uid,
          Pass: pass,
          AcceptToken: acceptToken,
        });
        if (setResult.Info === 'success') {
          $('#checkTransferOutModal').modal('hide');
        } else {
          this.replyStatus = {
            info: 'failed',
            msg: '回覆核可資料失敗'
          };
        }
      } else {
        this.replyStatus = {
          info: 'failed',
          msg: '寫入回覆失敗'
        };
      }
    } catch (error) {
      console.log(error);
      this.replyStatus = {
        info: 'failed',
        msg: '過程中發生錯誤'
      };
    } finally {
      this.isSetting = false;
    }
  }
}

interface ReplyStatus {
  info: string;
  msg: string;
}
