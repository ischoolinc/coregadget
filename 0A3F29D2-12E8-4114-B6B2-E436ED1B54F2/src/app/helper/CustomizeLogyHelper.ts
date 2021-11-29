
import { Injectable } from "@angular/core";
@Injectable({
  providedIn: 'root',
})
/** 處理特殊客製邏輯 */
export class CustomizeLogyHelper
{


  /** 判斷是否要顯示該試別 */
isExamShow(examName :string ){
    if(examName.includes("平時")){
     return false ;
    }else{
    return true ;
    }
  }
}
