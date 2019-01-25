import { Pipe, PipeTransform } from '@angular/core';

/**
 * 格式化學期的顯示文字
 */
@Pipe({
  name: 'semesterFormat',
  pure: false
})
export class SemesterFormatPipe implements PipeTransform {

  transform(semester: string): any {
    switch (semester) {
      case '0':
        return '夏季學期';
      case '1':
        return '第一學期';
      case '2':
        return '第二學期';
      default:
        return '';
    }
  }

}
