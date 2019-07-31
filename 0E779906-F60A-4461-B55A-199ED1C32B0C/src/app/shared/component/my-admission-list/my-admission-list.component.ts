import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Payment } from '../../../data';

@Component({
  selector: 'app-my-admission-list',
  templateUrl: './my-admission-list.component.html',
  styleUrls: ['./my-admission-list.component.css']
})
export class MyAdmissionListComponent implements OnInit {

  checkAll: boolean;
  paymentList: Payment[] = []; // 包含已淘汰及已入帳
  canCheckedCount = 0;

  // 正取或備取清單，包含已取消(淘汰)
  @Input()
  set list(value: Payment[]) {
    this.paymentList = value;
    this.canCheckedCount = value.filter(item => !item.IsDisabled).length;

    const checkedCount = this.paymentList.filter(value => value.Checked).length;
    if (this.canCheckedCount > 0 && this.canCheckedCount === checkedCount) {
      this.checkAll = true;
    } else {
      this.checkAll = false;
    }
  };

  @Output() callback: EventEmitter<Payment[]> = new EventEmitter();


  constructor() { }

  ngOnInit() {
  }

  /**全部勾選/全部取消項目 */
  handleAllChecked() {
    this.checkAll = !this.checkAll;
    const checkedList: Payment[] = [];

    this.paymentList.map(item => {
      if (!item.IsDisabled) {
        item.Checked = this.checkAll;
        if (this.checkAll) { checkedList.push(item); }
      }
    });
    this.callback.emit(checkedList);
  }

  /**勾選/取消勾選單一項目 */
  handleChecked(item: Payment) {
    item.Checked = !item.Checked;

    const checkedList = this.paymentList.filter(value => value.Checked);

    // 當已選總數等於可選總數，將全選設為 true
    if (checkedList.length === this.canCheckedCount) {
      this.checkAll = true;
    } else {
      this.checkAll = false;
    }

    this.callback.emit(checkedList);
  }
}
