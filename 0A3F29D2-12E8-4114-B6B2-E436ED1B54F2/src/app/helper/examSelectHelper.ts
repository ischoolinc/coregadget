import { Injectable } from "@angular/core";

import { Exam } from "../vo/vo";


@Injectable({
  providedIn: 'root',
})
export class ExamSelectedHelper{
   exams:Exam[] = []
   previousExam :Exam |undefined;
   currentExam : Exam |undefined;
   nextExam :Exam |undefined;
   public currentIndex : number  =0;
   setExams(exams:Exam[],currentIndex :number  ){
    //  alert(999)
     this.exams = exams;
     this.currentIndex  = currentIndex;
     this.indexChange(0);
   }

   /**缺換試別 */
   indexChange(index :number){
     this.currentIndex = index;
     this.previousExam = this.exams[index-1];
     this.currentExam = this.exams[index];
     this.nextExam = this.exams[index+1];
   }



}
