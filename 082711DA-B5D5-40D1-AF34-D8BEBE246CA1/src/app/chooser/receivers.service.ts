import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SelectionResult } from './data';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ReceiversService {

  // 建立一個可觀察對象
  receivers$ = new BehaviorSubject<SelectionResult[]>([] as SelectionResult[]);

  constructor(
    private snackbar: MatSnackBar,
  ) { }

  getReceivers(): SelectionResult[] {
    return this.receivers$.value;
  }
  // 推撥
  addReceivers(list: SelectionResult[]) {
    const merge = this.receivers$.value.concat(list);
    const unique = merge.reduce((unique, cur) => {
      const [first] = cur.IdList;
      unique.set(+first, cur);
      return unique;
    }, new Map<number, SelectionResult>());

    this.receivers$.next([...unique.values()]);
  }

  // 推撥
  removeReceiver(item: SelectionResult) {
    const idx = this.receivers$.value.findIndex(v => v === item);
    this.receivers$.value.splice(idx, 1);
    this.receivers$.next(this.receivers$.value);

    const lastRemove = item;

    this.snackbar.open(`已將「${item.displayText}」從清單中移除。`, '復原', {
      duration: 5000
    })
    .onAction()
    .subscribe(v => {
      this.receivers$.value.push(lastRemove);
      this.receivers$.next(this.receivers$.value);
    });
  }

  resetReceivers() {
    this.receivers$.next([]);
  }
}
