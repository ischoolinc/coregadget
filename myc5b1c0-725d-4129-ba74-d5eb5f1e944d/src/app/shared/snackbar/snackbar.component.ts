import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
})
export class SnackbarComponent {

  iconName: string;
  fontColor = '#fff';

  constructor(@Inject(MAT_SNACK_BAR_DATA) public args: any) {
    switch (args.type) {
      case 'success': this.iconName = 'ic:baseline-check-circle'; break;
      case 'error': this.iconName = 'ic:baseline-error'; break;
      case 'info': this.iconName = 'ic:baseline-info'; break;
      case 'warning': this.iconName = 'ic:baseline-warning'; break;
      default: this.iconName = args.type;
    }
  }
}
