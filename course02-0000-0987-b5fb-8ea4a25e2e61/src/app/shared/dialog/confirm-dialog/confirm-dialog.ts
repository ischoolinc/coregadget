export interface ConfirmDialogOptions {
  message?: string;
  header?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  accept?: () => any;
  reject?: () => any;
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
