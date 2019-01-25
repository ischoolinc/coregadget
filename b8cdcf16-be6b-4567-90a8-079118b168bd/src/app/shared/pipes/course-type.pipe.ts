import { Pipe, PipeTransform } from '@angular/core';

/**
 * 格式化課程類別顯示文字
 */
@Pipe({
  name: 'courseTypeFormat',
  pure: false
})
export class CourseTypeFormatPipe implements PipeTransform {

  transform(text: string): any {
    switch (text) {
      case '核心必修': return '核必';
      case '核心選修': return '核選';
      case '分組必修': return '組必';
      case '選修': return '選修';
      default: return text;
    }
  }
}
