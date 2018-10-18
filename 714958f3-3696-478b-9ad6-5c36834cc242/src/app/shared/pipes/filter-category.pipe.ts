import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCategory'
})
export class FilterCategoryPipe implements PipeTransform {

  transform(value: any, currCategory: string): any {
    if (currCategory === '全部類別') {
      return value;
    } else {
      return value.filter(item => item.category === currCategory);
    }
  }

}
