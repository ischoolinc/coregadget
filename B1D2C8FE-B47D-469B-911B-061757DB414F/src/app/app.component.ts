import { Component, ComponentFactoryResolver, Inject, OnInit } from '@angular/core';
import { GadgetService } from './gadget.service';
import { TagTeacherInfo, TeacherInfo, TeacherRec } from './vo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  tagNameList: TagTeacherInfo[] = [];
  head: string | undefined;
  accessPoint: string | undefined;
  schoolInfo: any;
  loading: boolean | undefined;
  error: any;
  title = 'TeacherInfo';
  saving = false;
  errMsg = '';
  tRec: TeacherInfo = {} as TeacherInfo;
  teacherName = '';
  nickname = '';
  hasTeacherCode = true;
  isShowInfo  =false ;

  constructor(private gadget: GadgetService) { }
  async ngOnInit() {
    this.head = 'Hello Gadget!';
    await this.loadTeacherInfo();
  }

  /** */
  async loadTeacherInfo() {
    try {
      const contract = await this.gadget.getContract('1campus.basicinfo.teacher');
      let rsp = await contract.send('_.GetTeacherSelfInfo');
      this.tRec = rsp.rs;
      // 確認有沒有教師代碼
      if (this.tRec.teachercode) { // 如果有教師代碼
        this.hasTeacherCode = true;
      } else {
        this.hasTeacherCode = false;
      }
    } catch (err) {
      alert("取得教師資訊發生錯誤" + JSON.stringify(err))
    }
  }

  /** 取得代碼 */
  async getNewCode() {
    try {
      const contract = await this.gadget.getContract('cloud.public');
      const rsp = await contract.send('beta.GetNewCode');
      console.log("update",rsp)
      this.tRec.teachercode = rsp.Code;
    } catch (ex) {
      alert("產生代碼發生錯誤")
    }
  }

  /** 儲存更新 */
  async updateTeacher() {
    try {
      const contract = await this.gadget.getContract('1campus.basicinfo.teacher');
      const rsp = await contract.send('_.UpdateTeacherCode',{
        Request :{
          TeacherCode :  this.tRec.teachercode
        }
      });
     //有重複代碼判斷
     if(rsp.rs =='代碼重複'){

        alert("教師代碼重複!請在產生一次")
       return
     }else {

        alert("儲存成功!")
     }
    } catch (ex) {
      alert("更新教師代碼發生錯誤");
    }finally{
      this.loadTeacherInfo();
    }
  }
}
