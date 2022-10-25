import { Component, OnInit } from '@angular/core';
import { DsaTransferService } from '../../service/dsa-transfer.service';
import { TransferStudentsService } from '../../service/transfer-students.service';
import { TransStudentRec } from '../transfer-in.component';

@Component({
  selector: 'app-transfer-data-modal',
  templateUrl: './transfer-data-modal.component.html',
  styleUrls: ['./transfer-data-modal.component.css']
})
export class TransferDataModalComponent implements OnInit {

  isSaving = false;
  transDataStatus: TransDataStatus = {} as TransDataStatus;
  targetStudent: TransStudentRec = {} as TransStudentRec;
  sourceData: any;

  constructor(
    private dsaService: DsaTransferService,
    private transferSrv: TransferStudentsService
  ) { }

  ngOnInit() {
  }

  loadDefault(item: TransStudentRec) {
    this.isSaving = false;
    this.targetStudent = item;
    this.transDataStatus = {} as TransDataStatus;
    this.sourceData = null;
  }

  async getTransData() {
    if (!this.sourceData) {
      try {
        const rsp = await this.dsaService.accessPointSend({
          dsns: this.targetStudent.DSNS,
          contractName:  '1campus.counsel.transfer_out',
          securityTokenType: 'Basic',
          serviceName: 'GetTransCounselData',
          BasicValue: { UserName: `${this.targetStudent.TransferToken}-${this.targetStudent.AcceptToken}`, Password: '1234' },
          body: '',
          rootNote: 'Section'
        });

        try {
          await this.transferSrv.addLog('轉入資料', '向轉出校取得資料', `
            取得成功。\n
            TransferToken：${this.targetStudent.TransferToken}\n
            AcceptToken：${this.targetStudent.AcceptToken}\n
            Source：${JSON.stringify(rsp)}
          `);

          this.sourceData = [].concat(rsp || []);
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        this.sourceData = null;
        try {
          await this.transferSrv.addLog('轉入資料', '向轉出校取得資料', `
            取得失敗。\n
            TransferToken：${this.targetStudent.TransferToken}\n
            AcceptToken：${this.targetStudent.AcceptToken}\n
            ERROR：${JSON.stringify(error)}
          `);
        } catch (error) {
          console.log(error);
        }
      }
    }
    return this.sourceData;
  }

  async beginTransData() {
    if (this.isSaving) return;

    try {
      this.isSaving = true;
      this.transDataStatus = { info: '', msg: '' };

      const sourceData = await this.getTransData();
      if (sourceData) {
        // console.log(sourceData);
        const inTransBody = {
          TransferToken: this.targetStudent.TransferToken,
          AcceptToken: this.targetStudent.AcceptToken,
          SourceData: sourceData,
        };

        const transResult = await this.dsaService.send('TransferStudent.SetTransData', inTransBody);
        if (transResult.Info.TargetTokenCheck === 't'
          && transResult.Info.TargetStatusCheck === 't'
          && transResult.Info.UpdateCheck === 't'
        ) {
          try {
            await this.transferSrv.addLog('轉入資料', '轉入本校',
              `轉入成功。\n
              TransferToken：${this.targetStudent.TransferToken}\n
              AcceptToken：${this.targetStudent.AcceptToken}\n`);
          } catch (error) {
            console.log(error);
          }

          $('#transferDataModal').modal('hide');
        } else {
          try {
            await this.transferSrv.addLog('轉入資料', '轉入本校',
              `轉入失敗。\n
              TransferToken：${this.targetStudent.TransferToken}\n
              AcceptToken：${this.targetStudent.AcceptToken}\n
              ERROR:\n
              TargetTokenCheck = ${transResult.Info.TargetTokenCheck}\n
              TargetStatusCheck = ${transResult.Info.TargetStatusCheck}\n
              UpdateCheck = ${transResult.Info.UpdateCheck}\n`);
          } catch (error) {
            console.log(error);
          }

          let errMsg = '';
          if (transResult.Info.TargetTokenCheck !== 't') {
            errMsg = '代碼不正確';
          }
          if (transResult.Info.TargetStatusCheck !== 't') {
            errMsg = '狀態不正確';
          }
          if (transResult.Info.UpdateCheck !== 't') {
            errMsg = '無符合資料可轉入';
          }
          this.transDataStatus = {
            info: 'failed',
            msg: errMsg || '未知的錯誤',
          };
        }
      } else {
        try {
          await this.transferSrv.addLog('轉入資料', '向轉出校取得資料', `
            取得轉入資料為空。\n
            轉入系統編號：${this.targetStudent.Uid}\n
            學生系統編號：${this.targetStudent.StudentId}`);
        } catch (error) {
          console.log(error);
        }

        this.transDataStatus = {
          info: 'failed',
          msg: '取得轉入資料失敗'
        };
      }
    } catch (error) {
      this.transDataStatus = {
        info: 'failed',
        msg: '過程中發生錯誤'
      };
    } finally {
      this.isSaving = false;
    }
  }
}

interface TransDataStatus {
  info: string;
  msg: string;
}