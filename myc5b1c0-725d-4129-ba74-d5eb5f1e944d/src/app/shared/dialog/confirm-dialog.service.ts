import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogOptions, ModalSize } from './confirm-dialog/confirm-dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  dialogRef?: MatDialogRef<ConfirmDialogComponent>;

  constructor(private dialog: MatDialog) { }

  show(options: ConfirmDialogOptions) {
    const defaultOptions = {
      message: '您確定嗎？',
      header: '',
      acceptLabel: '確定',
      rejectLabel: '取消',
      accept: () => this.dialogRef?.close(),
      reject: () => this.dialogRef?.close(),
      acceptButtonStyleClass: 'inline-block btn btn-primary px-4',
      rejectButtonStyleClass: 'inline-block btn py-2 mr-2 text-gray-text3 px-4 border-transparent rounded-full hover:text-primary focus:outline-none',
      acceptVisible: true,
      rejectVisible: true,
      modalSize: ModalSize.MD,
    };

    const mergeOptions = { ...defaultOptions, ...options };

    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: mergeOptions,
      maxWidth: mergeOptions.modalSize,
    });
  }

  hide() {
    this.dialogRef?.close();
  }
}
