import { Pipe, PipeTransform } from '@angular/core';
import { ClassRec } from '../../data/teacher';


/**
 * 將 Maps 轉為陣列，使其在 *ngFor 可正常運作
 */
@Pipe({
  name: 'classnamesPipe',
  pure: false
})
export class ClassNamesPipe implements PipeTransform {

  transform(value: ClassRec[]): any {
    return value.map(v => v.ClassName).join(', ');
  }

}
