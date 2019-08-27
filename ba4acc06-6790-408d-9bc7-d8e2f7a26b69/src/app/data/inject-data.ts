import { MatDialogRef } from '@angular/material';
import { ChooserComponent } from '../chooser/chooser.component';

export interface InjectData {

  dialogRef: MatDialogRef<ChooserComponent, any>;

  target: 'TEACHER' | 'STUDENT';
}
