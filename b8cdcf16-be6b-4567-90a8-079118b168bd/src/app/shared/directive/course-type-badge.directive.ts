import { Directive, ElementRef, Input } from '@angular/core';
import { CourseTypeFormatPipe } from '../pipes/course-type.pipe';

/**
 * 格式化課程類別顯示樣式
 */
@Directive({
  selector: '[appCourseTypeBadge]'
})
export class CourseTypeBadgeDirective {

  @Input('appCourseTypeBadge') set appCourseTypeBadge(text: string) {
    let className = '';

    switch (text) {
      case '核心必修':
        className = 'label-important';
        break;
      case '核心選修':
        className = 'label-warning';
        break;
      case '分組必修':
        className = 'label-success';
        break;
      case '選修':
        className = 'my-label-info';
        break;
    }

    if (className) { this.el.nativeElement.classList.add(className); }
    this.el.nativeElement.innerText = this.courseTypeFormatPipe.transform(text);
  }

  constructor(private el: ElementRef,
    private courseTypeFormatPipe: CourseTypeFormatPipe) {}
}
