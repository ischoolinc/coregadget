import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'totalAvgPipe'
  
})

export class avgPipe implements PipeTransform {

  transform(val: number,precision: number,carry: string): any {
    if(carry  === '無條件進位'){
      return (Math.ceil(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0))).toFixed(precision);
    }else if(carry  === '無條件捨去'){
      return (Math.floor(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0))).toFixed(precision);
    }else{
      return (Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0))).toFixed(precision);
    }
  }
}