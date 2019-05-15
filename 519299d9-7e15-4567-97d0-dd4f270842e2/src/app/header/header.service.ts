import { Injectable } from '@angular/core';
import { HeaderComponent } from './header.component';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private header: HeaderComponent;

  constructor() { }

  public register(header: HeaderComponent) {
    this.header = header;
  }

  public setNavigation(leaf: NavigationItem) {
    this.header.setLeaf(leaf);
  }
}

export interface NavigationItem {
  title: string;

  link: string[];

  parent: NavigationItem;
}
