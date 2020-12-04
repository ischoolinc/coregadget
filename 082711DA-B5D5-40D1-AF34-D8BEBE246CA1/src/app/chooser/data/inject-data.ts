import { MatDialogRef } from '@angular/material/dialog';
import { ChooserComponent } from '../chooser.component';

export interface InjectData {

  dialogRef: MatDialogRef<ChooserComponent, any>;

  target: 'TEACHER' | 'STUDENT';
}
