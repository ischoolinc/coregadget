import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  constructor() { }


  /**確認成績 是Term Subject accessment */
  checkScoreType(customAssessment:string , assessment :string, subject :string ,term :string ):string {
    if(customAssessment!=""){
      return "customAssessment" ;
    }else if(customAssessment=="" && assessment!=""){ // assessment score
      return "assessment" ;
    }else if(assessment =="" && subject!=="" && term !=="") //subject score
     {
      return "subject" ;

    }else if(assessment==""&& subject == ""&& term !==""){ // term score

      return "term" ;
    }
    return "" ;

  }

}
