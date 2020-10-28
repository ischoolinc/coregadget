import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textFilter'
})
export class TextFilterPipe implements PipeTransform {

  transform(value: string): any {
    if(value.length >= 20){
      var finalvalue="";
      finalvalue = value.substring(0,10) + "...";
    }else{
      finalvalue = value;
    }
    return finalvalue;
  }

}
