import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }


/**
 * 取得日期格式
 */
getFormatDateString(dateString: string):string{
 let  sdate= new Date(dateString);
 let year= sdate.getFullYear() ;
 let mon =sdate.getMonth()+1;
 let date = sdate.getDate();
 let day =sdate.getDay();
 let weekDay='';

 switch (day) {
  case  0:
    weekDay = '日'
    break;
  case  1:
    weekDay = '一'
    break;
  case  2:
    weekDay = '二'
    break;
  case  3:
    weekDay = '三'
    break;
  case  4:
    weekDay = '四'
    break;
  case  5:
    weekDay = '五'
    break;
  case  6:
    weekDay = '六'
    break;
 }
 return `${year}/${mon}/ ${date} (${weekDay})`;
}
}
