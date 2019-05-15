import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectionResult } from 'src/app/chooser/selection-result';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SelectedDetailComponent } from '../../chooser/seleted-detail/selected-detail.component';

@Component({
  selector: 'app-receiver-list',
  templateUrl: './receiver-list.component.html',
  styleUrls: ['./receiver-list.component.scss']
})
export class ReceiverListComponent implements OnInit {

  lastRemove: SelectionResult = null;

  constructor(
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
  ) { }

  @Input() receivers: SelectionResult[];

  @Output() receiversChange = new EventEmitter<SelectionResult[]>();

  ngOnInit() {
  }

  removeSelectionItem(item: SelectionResult) {
    const idx = this.receivers.findIndex(v => v === item);
    this.receivers.splice(idx, 1);
    this.receiversChange.emit(this.receivers);

    this.lastRemove = item;

    this.snackbar.open(`已將「${item.displayText}」從收件者移除。`, "復原", {
      duration: 5000
    }).onAction()
    .subscribe(v => {
      this.receivers.push(this.lastRemove);
      this.receiversChange.emit(this.receivers);
    });
  }


  showDetail(item: SelectionResult) {

    if (!item.previewable) { return; }

    this.dialog.open(SelectedDetailComponent, {
      data: item
    });
  }

}
