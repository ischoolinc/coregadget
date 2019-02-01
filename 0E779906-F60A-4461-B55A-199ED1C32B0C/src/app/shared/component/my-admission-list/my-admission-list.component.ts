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
  cannotCheckedCount = 0;

  @Input() type: string;
  @Input() canPayment: boolean;

  // 正取或備取清單，包含已取消(淘汰)
  @Input()
  set list(value: Payment[]) {
    this.paymentList = value;
    this.cannotCheckedCount = value.filter(item => item.Cancel !== 't' && item.VerifyAccounting !== 't').length;

    const checkedCount = this.paymentList.filter(value => value.Checked).length;
    if (this.cannotCheckedCount > 0 && this.cannotCheckedCount === checkedCount) {
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
    if (this.canPayment) {
      this.checkAll = !this.checkAll;
      const checkedList: Payment[] = [];

      this.paymentList.map(item => {
        if (item.Cancel !== 't' && item.VerifyAccounting !== 't') {
          item.Checked = this.checkAll;
          if (this.checkAll) { checkedList.push(item); }
        }
      });
      this.callback.emit(checkedList);
    }
  }

  /**勾選/取消勾選單一項目 */
  handleChecked(item: Payment) {
    if (this.canPayment) {
      item.Checked = !item.Checked;

      const checkedList = this.paymentList.filter(value => value.Checked);

      // 當已選總數等於可選總數，將全選設為 true
      if (checkedList.length === this.cannotCheckedCount) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }

      this.callback.emit(checkedList);
    }
  }
}
