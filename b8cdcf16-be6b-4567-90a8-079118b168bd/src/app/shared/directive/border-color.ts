import { Directive, ElementRef, Input } from '@angular/core';

/**
 * 格式化課程類別顯示樣式
 */
@Directive({
  selector: '[appBorderColor]'
})
export class BorderColorDirective {

  constructor( private el: ElementRef ) {}


  @Input('appBorderColor') set appBorderColor(text: string) {
    let addstyle = '';

    switch (text) {
      case '核心必修':
        addstyle = 'border-left-color: #b94a48; color: #b94a48;';
        break;
      case '核心選修':
        addstyle = 'border-left-color: #f89406; color: #f89406;';
        break;
      case '分組必修':
        addstyle = 'border-left-color: #468847; color: #468847;';
        break;
      case '選修':
        addstyle = 'border-left-color: #804688; color: #804688;';
        break;
      case 't':
        addstyle = 'border-left-color: #FFC300; color: #FFC300;';
        break;
    }

    this.el.nativeElement.style.cssText += addstyle;
  }

}
