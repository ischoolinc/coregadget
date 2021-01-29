import { Directive, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appSpy]'
})
export class SpyDirective implements OnInit, OnDestroy {

  constructor() { }
  
  ngOnInit(): void {
    console.log('🚀 DOM on init');
  }

  ngOnDestroy(): void {
    console.log('🗑️ DOM on destroy');
  }

}
