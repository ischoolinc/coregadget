import { Component, OnInit } from '@angular/core';
import { CaseStudent } from 'src/app/case/case-student';
import { TeacherWork } from './teacher-work';

@Component({
  selector: 'app-new-work-modal',
  templateUrl: './new-work-modal.component.html',
  styleUrls: ['./new-work-modal.component.css']
})
export class NewWorkModalComponent implements OnInit {

  title :string ="";
  accessObjects =[];
  accessObjectStudent :string[]=[];
  accessObjectOther :string[]=["教職員","家長","專業人員"]
  currentWork : TeacherWork = new TeacherWork() ;
  constructor() { }

  ngOnInit() {
    //初始化對象選項
    this.accessObjectStudent=["七年級學生","八年級學生","九年級學生"];
    this.accessObjects =this.accessObjectStudent.concat(this.accessObjectOther);
  }

  checkChange(){}



 /** 設定受訪對象 */
 setAccessObject()
 {

 }

}
