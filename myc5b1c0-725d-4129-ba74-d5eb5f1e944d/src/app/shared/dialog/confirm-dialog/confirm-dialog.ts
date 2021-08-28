import { MatDialogRef } from "@angular/material/dialog";

export interface ConfirmDialogOptions {
  message: string;
  header?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  accept: (ref: MatDialogRef<any>) => any;
  reject?: (ref: MatDialogRef<any>) => any;
  acceptButtonStyleClass?: string;
  rejectButtonStyleClass?: string;
  acceptVisible?: boolean;
  rejectVisible?: boolean;
  modalSize?: ModalSize;
}

export enum ModalSize {
  SM = '300px',
  MD = '500px',
  LG = '800px',
  XL = '1140px',
}
