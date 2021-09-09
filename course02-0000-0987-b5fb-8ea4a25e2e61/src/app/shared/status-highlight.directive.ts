import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appStatusHighlight]'
})
export class StatusHighlightDirective implements OnInit {

  @Input() appStatusHighlight?: string;

  constructor(private elem: ElementRef) {}

  ngOnInit(): void {
    switch (this.appStatusHighlight) {
      case '1': this.elem.nativeElement.className += ' text-primary'; break;
      case '2': this.elem.nativeElement.className += ' text-primary'; break;
      case '4': this.elem.nativeElement.className += ' text-warning'; break;
      case '8': this.elem.nativeElement.className += ' text-warning'; break;
      case '16': this.elem.nativeElement.className += ' text-warning'; break;
      case '256': this.elem.nativeElement.className += ' text-warning'; break;
      default: this.elem.nativeElement.className += ' text-primary'; break;
    }
  }
}
