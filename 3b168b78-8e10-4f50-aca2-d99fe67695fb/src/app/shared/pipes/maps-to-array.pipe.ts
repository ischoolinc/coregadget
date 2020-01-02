import { Pipe, PipeTransform } from '@angular/core';

/**
 * 將 Maps 轉為陣列，使其在 *ngFor 可正常運作
 */
@Pipe({
  name: 'mapsToArray',
  pure: false
})
export class MapsToArrayPipe implements PipeTransform {

  transform(value: Map<any, any>): any {
    return Array.from(value.values());
  }

}
