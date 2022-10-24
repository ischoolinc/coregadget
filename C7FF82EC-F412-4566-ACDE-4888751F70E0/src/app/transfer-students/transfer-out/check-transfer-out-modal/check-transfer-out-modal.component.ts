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
      // 3. 新增 log

      const replyBody = `<Request>
        <AcceptToken>${acceptToken}</AcceptToken>
        <Pass>${pass}</Pass>
        <RedPointCode>轉入申請</RedPointCode>
      </Request>`;

      const replyResult = await this.dsaService.accessPointSend({
        dsns: this.studentData.DSNS,
        contractName:  '1campus.counsel.transfer_in',
        securityTokenType: 'Basic',
        BasicValue: { UserName: this.studentData.TransferToken, Password: '1234' },
        serviceName: 'SetApprovedStatusAndRedPoint',
        body: replyBody,
        rootNote: 'Info'
      });

      if (replyResult === 'success') {
        try {
          await this.transferSrv.addLog('回覆申請', `回覆轉入校-${pass ? '核可' : '拒絕'}`,
            `成功。StudentId：${this.studentData.StudentId}。TransInID：${this.studentData.Uid}`,
            replyBody);
        } catch (error) {
          console.log(error);
        }

        const setBody = {
          Uid: this.studentData.Uid,
          Pass: pass,
          AcceptToken: acceptToken,
        };

        const setResult = await this.dsaService.send('TransferStudent.SetApprovedStatus', setBody);
        if (setResult.Info === 'success') {
          try {
            await this.transferSrv.addLog('回覆申請', `本校回覆-${pass ? '核可' : '拒絕'}`,
              `成功。StudentId：${this.studentData.StudentId}。TransInID：${this.studentData.Uid}`,
              JSON.stringify(setBody));
          } catch (error) {
            console.log(error);
          }

          $('#checkTransferOutModal').modal('hide');
        } else {
          try {
            await this.transferSrv.addLog('回覆申請', `本校回覆-${pass ? '核可' : '拒絕'}`,
              `失敗。StudentId：${this.studentData.StudentId}。TransInID：${this.studentData.Uid}`,
              JSON.stringify(setBody));
          } catch (error) {
            console.log(error);
          }

          this.replyStatus = {
            info: 'failed',
            msg: '回覆核可資料失敗'
          };
        }
      } else {
        try {
          await this.transferSrv.addLog('回覆申請', `回覆轉入校-${pass ? '核可' : '拒絕'}`,
            `失敗。StudentId：${this.studentData.StudentId}。TransInID：${this.studentData.Uid}`,
            replyBody);
        } catch (error) {
          console.log(error);
        }

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
