import { Component, OnInit } from '@angular/core';
import { HeaderService, NavigationItem } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  navigations: NavigationItem[] = [];

  constructor(
    headersrv: HeaderService
  ) {
    headersrv.register(this);
  }

  ngOnInit() {
  }

  public setLeaf(item: NavigationItem) {
    if (!!item.title) { // 如果沒有 title 代表不是一個 NavigationItem。

      this.navigations = [item];
      let current = item;
      while (!!current.parent) {
        this.navigations.push(current.parent);
        current = current.parent;
      }
      this.navigations = this.navigations.reverse();
    }
  }
}
