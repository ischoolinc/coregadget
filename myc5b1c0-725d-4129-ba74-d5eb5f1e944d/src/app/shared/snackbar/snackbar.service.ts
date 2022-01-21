import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarModule } from './snackbar.module';
import { SnackbarOptions } from './snackbar';
import { SnackbarComponent } from './snackbar.component';

@Injectable({
  providedIn: SnackbarModule
})
export class SnackbarService {

  constructor(public snackBar: MatSnackBar) { }

  show(message: string, options: SnackbarOptions = {} as SnackbarOptions) {
    const type = options.type || 'error';

    let bgStyle = 'bg-third-dark';
    switch (type) {
      case 'success': bgStyle = 'bg-success'; break;
      case 'error': bgStyle = 'bg-warning'; break;
      case 'info': bgStyle = 'bg-primary'; break;
      case 'warning': bgStyle = 'bg-third-dark'; break;
    }

    this.snackBar.openFromComponent(SnackbarComponent, {
      data: {
        message,
        type,
      },
      duration: options.duration || 10 * 1000,
      panelClass: options.panelClass || bgStyle,
      horizontalPosition: options.horizontalPosition || 'center',
      verticalPosition: options.verticalPosition || 'bottom',
    });
  }
}
