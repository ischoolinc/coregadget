import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SelectionResult } from './data';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ReceiversService {

  receivers$ = new BehaviorSubject<SelectionResult[]>([] as SelectionResult[]);

  constructor(
    private snackbar: MatSnackBar,
  ) { }

  getReceivers(): SelectionResult[] {
    return this.receivers$.value;
  }

  addReceivers(list: SelectionResult[]) {
    this.receivers$.next(this.receivers$.value.concat(list));
  }

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
