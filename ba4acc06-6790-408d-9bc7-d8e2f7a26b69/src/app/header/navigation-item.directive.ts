import { Directive, Input } from '@angular/core';
import { NavigationItem } from './header.service';

@Directive({
  selector: '[appNavigationItem]',
  exportAs: 'appNavigationItem'
})
export class NavigationItemDirective {

  constructor() { }

  @Input() appNavigationItem: NavigationItem;
}
