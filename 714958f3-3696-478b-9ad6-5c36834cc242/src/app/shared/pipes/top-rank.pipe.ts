import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'topRank'
})
export class TopRankPipe implements PipeTransform {

  transform(value: any, top: number): any {
    return value.filter(v => v.rank <= top);
  }

}
