import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransferStudentsService {
  constructor() { }

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
}
