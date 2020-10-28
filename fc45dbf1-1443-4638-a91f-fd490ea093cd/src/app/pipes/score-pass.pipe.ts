import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scorePass'
})
export class ScorePassPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    let valueNum: number;
    let scoreColor = "\"color:red;\""
    valueNum = parseInt(value);
    if(valueNum < 60){
      return scoreColor;
    }
    return null;
  }

}
