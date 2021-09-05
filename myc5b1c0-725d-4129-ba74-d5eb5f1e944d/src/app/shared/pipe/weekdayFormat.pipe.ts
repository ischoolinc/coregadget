import { Pipe, PipeTransform } from '@angular/core';

/**
 * 將數字類型的星期轉成中文字，1~7，1: 星期一
 */
@Pipe({
  name: 'weekdayFormat',
  pure: false
})
export class WeekdayFormatPipe implements PipeTransform {

  transform(value: number | undefined): any {
    const strValue = '' + value;
    switch (strValue) {
      case '1': return '一';
      case '2': return '二';
      case '3': return '三';
      case '4': return '四';
      case '5': return '五';
      case '6': return '六';
      case '7': return '日';
      default: return strValue;
    }
  }

}
