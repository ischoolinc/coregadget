import { ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { GadgetService } from './gadget.service';
import { Student, StudentAttendance } from './vo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  StudentAttendanceList :  StudentAttendance[] =[];
  /** 放學生清單 */
  StudentList :Student[] =[] ;
  PeriodList : any[] = [] ;
  isShowDetail :boolean = false ;
  /** 導師所帶班級 */
  MyClassList :any[] =[] ;
  currClass :any ;

  constructor(
    private gadget: GadgetService) {
  }
  head: string | any;
  accessPoint: string | any
  schoolInfo: any | any
  loading: boolean | any
  error: any;
  currClassID :number  |any  = 8;
  async ngOnInit() {
    await this.getPeriod();
    await this.getMyClass(); // 1. 取得我的班級

    await this.loadData(); // 2 .取得缺礦資料

  }

  /** 取得學生及缺礦資料 */
  async loadData(){
    await this.getStudentList () ; // 2. 取得學生資料
    await this.getStudentAttendInfos() ; // 3. 取得學生缺礦資料



  }

  /** 取得班導師 帶班班級  */
  async getMyClass() {
    try {
      this.loading = true;
      const contract = await this.gadget.getContract('campus.rollcall.teacher');
      let rsp = await contract.send("GetMyClasses");
      this.MyClassList =[].concat(rsp.rs);
      this.currClass =this.MyClassList[0] ;
      console.log("my",this.MyClassList);
      // alert(this.devUse(rsp));
    } catch (ex) {
      alert("取得班級發生錯誤!" + JSON.stringify(ex))
    } finally {
      this.loading = false;
    }
  }


  /** 取得該班級學生資料  */
  async getStudentAttendInfos() {


    try {
      this.loading = true;
      const contract = await this.gadget.getContract('campus.rollcall.teacher');
      let rsp = await contract.send("GetAllStudentAttendanceFromHomeroomTeacher",{
      Request : {
         Type : 'Class',
         ClassID :this.currClass.id
      }

      });
      this.StudentAttendanceList = [].concat(rsp.rs || []) ;
      // alert(this.StudentAttendanceList);

      console.log("this.StudentAttendanceList",this.StudentAttendanceList) ;
    } catch (ex) {
      alert("取得班級發生錯誤!" + JSON.stringify(ex))
    } finally {
      this.loading = false;
    }



  }

/** 取得學生資訊 */
async getStudentList(){
  try {
    this.loading = true;
    const contract = await this.gadget.getContract('campus.rollcall.teacher');
    let rsp = await contract.send("GetStudentByClassID",{ Request : {ClassID  :this.currClass.id }});
    this.StudentList = [].concat(rsp.rs || []) ;
    console.log("this.StudentList",this.StudentList) ;
  } catch (ex) {
    alert("取得班級發生錯誤!" + JSON.stringify(ex))
  } finally {
    this.loading = false;
  }
}


/** 取得節次   */
async getPeriod(){
  try {
    this.loading = true;
    const contract = await this.gadget.getContract('campus.rollcall.teacher');
    let rsp = await contract.send("GetConfig");
    this.PeriodList = [].concat(rsp.Config.Periods.Period|| []) ;
    console.log("this.rsp",this.PeriodList) ;
  } catch (ex) {
    alert("取得班級發生錯誤!" + JSON.stringify(ex))
  } finally {
    this.loading = false;
  }


}

/** 取得缺礦類別 */
getAbsenceType( studentID :string  ,period :string ){
  return    this.StudentAttendanceList.find(x=> x.id == studentID && x.now_attendance_period == period  )

}

/**  點選顯示 明細*/
toogleShowdetail(){
this.isShowDetail =!this.isShowDetail;
}


/** */
async setCurrentClass(classInfo : any){

   this.currClass = classInfo ;
   await  this.loadData() ;

}
/** 匯出  */
exportData(selector :any) {
  var downloadLink;
  var dataType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;';
  var tableSelect = document.querySelector(selector);
  var tableHTML = encodeURIComponent('<style> table, td {border:1px solid #dee2e6;  text-align: center;} table {border-collapse:collapse}</style>' + tableSelect.outerHTML);

  // Specify file name
  var filename ='今日缺礦'+'.xls';

  // Create download link element
  downloadLink = document.createElement("a");

  document.body.appendChild(downloadLink);

  if(navigator.msSaveOrOpenBlob){
      var blob = new Blob([tableHTML], {
          type: dataType
      });
      navigator.msSaveOrOpenBlob( blob, filename);
  } else {
      // Create a link to the file
      downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

      // Setting the file name
      downloadLink.download = filename;

      //triggering the function
      downloadLink.click();
  }
}

  /** */
devUse(obj: any) {
    return JSON.stringify(obj)

}
}
