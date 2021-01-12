import { Directive, ElementRef, Input  } from '@angular/core';


@Directive({
  selector: '[appCreditType]'
})
export class CreditTypeDirective {

  @Input('appCreditType') set appCreditType(value: boolean) {
    let creditValuetype = '';

    if( value === false ){
      creditValuetype = 'label-failed';
    }
    
    if (creditValuetype) { this.el.nativeElement.classList.add(creditValuetype); }
  }
  constructor(private el: ElementRef) { }

}
