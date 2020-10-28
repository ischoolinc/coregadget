import { Directive, ElementRef, Input  } from '@angular/core';


@Directive({
  selector: '[appScoreType]'
})
export class ScoreTypeDirective {

  @Input('appScoreType') set appScoreType(value: string) {
    let scoreValuetype = '';

    if(parseFloat(value) < 60 ){
      scoreValuetype = 'label-failed';
    }
    
    if (scoreValuetype) { this.el.nativeElement.classList.add(scoreValuetype); }
  }
  constructor(private el: ElementRef) { }

}
