import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, Subject } from 'rxjs';
import { ChooserComponent } from '../chooser.component';
import { SelectionResult } from '../data';
import { ReceiversService } from '../receivers.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit, OnDestroy {

  items: SelectionResult[];

  private destroy$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private receiver: ReceiversService
  ) { }

  ngOnInit(): void {
    this.receiver.receivers$.pipe(
      takeUntil(this.destroy$),
    )
    .subscribe(v => {
      this.items = v;
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  openChooser() {
    this.dialog.open<ChooserComponent, {}, SelectionResult[]>(ChooserComponent, {
      data: { target: 'STUDENT' },
      width: '80%',
      disableClose: false,
    });
  }

}
