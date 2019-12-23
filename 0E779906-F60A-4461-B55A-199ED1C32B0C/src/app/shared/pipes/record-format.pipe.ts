import { Pipe, PipeTransform } from '@angular/core';
import { Payment } from '../../data/payment';

@Pipe({
  name: 'recordFormat'
})
export class RecordFormatPipe implements PipeTransform {

  transform(paymen: Payment): any {
    // 1. 判斷繳費時間
    // 2. 繳費時間後 顯示 (尚未對帳/對帳成功/逾期未繳費，視同放棄)
    // 3. 繳費期間內 顯示 (尚未繳費/尚未對帳/對帳成功)

    // 對帳成功：學生有填繳款通知，EMBA有對帳
    // 逾期未繳費，視同放棄：學生沒有填寫繳款通知 (繳費期後)
    // 尚未對帳：學生有填寫繳款單，EMBA尚未做對帳的動作

    let ret = '';
    // 已被篩汰
    if (paymen.Cancel === 't') {
      ret = '逾期未繳費，視同放棄';
    } else {
      // 尚未對帳成功
      if (paymen.VerifyAccounting === 'f') {
        if (paymen.FillInDate) {
          ret = '尚未對帳';
        } else {
          ret = '尚未繳費';
        }
      } else {
        ret = '對帳成功';
      }
    }
    return ret;
  }
}
