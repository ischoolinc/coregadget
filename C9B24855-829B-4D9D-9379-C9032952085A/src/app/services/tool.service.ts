import { Injectable } from '@angular/core';
// import { ConsoleReporter } from 'jasmine';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  constructor() { }


  /**確認成績 是Term Subject accessment */
  checkScoreType(customAssessment: string, assessment: string, subject: string, term: string): string {
    if (customAssessment != "") {
      return "customAssessment";
    } else if (customAssessment == "" && assessment != ""&& subject !== "" && term !== "") { // assessment score
      return "assessment";
    } else if (assessment == "" && subject !== "" && term !== "") //subject score
    {
      return "subject";

    } else if (assessment == "" && subject == "" && term !== "") { // term score

      return "term";
    }
    return "";

  }


  /**確認此學生在這個range  */
  checkStudentAtThisRange(min: number, max: number, currentScoreStr: string) :boolean {

    let currentScore = parseFloat(currentScoreStr);

    if (min >= currentScore && currentScore <= max) {
      console.log('min',min);
      console.log('currentScore',currentScore);
      console.log('max',max);
      console.log('----------------------------')

      return true;
    } else {

      return false;
    }

  }

}
