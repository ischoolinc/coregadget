import { Injectable } from '@angular/core';
import { DsaService } from 'src/app/dsa.service';

@Injectable({
  providedIn: 'root'
})
export class TransferStudentsService {
  constructor(
    private dsaSrv: DsaService
  ) { }

  public formatStudentStatus(status: string) {
    switch (status) {
      case '1': return '一般';
      case '2': return '延修';
      case '4': return '休學';
      case '8': return '輟學';
      case '16': return '畢業或離校';
      case '256': return '刪除';
    }
  }

  public async addLog(actionType = '', action = '', description = '', diag = '') {
    await this.dsaSrv.send('TransferStudent.AddLog', {
      Request: {
        ActionType: actionType,
        Action: action,
        Description: description,
        Diag: diag,
      }
    });
  }
}
