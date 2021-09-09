import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogOptions, ModalSize } from './confirm-dialog/confirm-dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  dialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(private dialog: MatDialog) { }

  show(options: ConfirmDialogOptions) {
    options = {
      message: '您確定嗎？',
      header: '',
      acceptLabel: '確定',
      rejectLabel: '取消',
      accept: () => this.dialogRef.close(),
      reject: () => this.dialogRef.close(),
      acceptButtonStyleClass: 'btn btn-info',
      rejectButtonStyleClass: 'btn btn-light text-black-secondary',
      acceptVisible: true,
      rejectVisible: true,
      modalSize: ModalSize.MD,
      ...options
    };

    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: options,
      maxWidth: options.modalSize,
    });
  }

  hide() {
    this.dialogRef.close();
  }
}
