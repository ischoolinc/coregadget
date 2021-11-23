import { Component } from '@angular/core';
import { GadgetService } from './gadget.service';
import { RankInfo, studentInfo, RankInfoSource, ChildInfo } from './vo/vo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentStudent: ChildInfo | undefined;
  currentStudentRankInto: studentInfo | undefined;
  loading = false;
  accessPoint = "";
  studentRankInfo: studentInfo | undefined
  user_rule: '' | '' = "";
  error: any;
  role: string = "";
  myChilern: ChildInfo[] = []
  //建構子
  constructor(
    private gadget: GadgetService) {
  }

  async ngOnInit() {
    // 取得腳色
    this.role = gadget.params.role;
    // 取得家長或學生之腳色
    // 1.抓取學生班牌 類組牌
    if (this.role == "student") {
      await this.getRankByStuRole();
    } else if (this.role == "parent") {
      await this.getStudentInfo();
      await this.getRankBtParentRole();
    }
  }

  /** */
  async clickChild(child: ChildInfo) {
    this.setSelectd(child)
    this.currentStudent = child;
    await this.getRankBtParentRole()

  }
  /**家長身分時取得自己的小孩 */
  async getStudentInfo() {
    this.myChilern = [];
    // 取得 contract 連線。
    const contract = await this.gadget.getContract('1campus.exam.rank.parent');
    // 呼叫 service。
    let rsp = await contract.send('_.GetStudentInfo', {


    });

    console.log("rsp.Result.Student", rsp.Result.Student);

    [].concat(rsp.Result.Student || []).forEach(studentInfo => {
      if (studentInfo) {
        this.myChilern.push(studentInfo);
      }

    })

    this.currentStudent = this.myChilern[0]
    this.currentStudent.isSelected = true;
  }

  async getRankBtParentRole() {

    // 取得孩子資訊

    try {
      this.loading = true;
      // 取得 contract 連線。
      const contract = await this.gadget.getContract('1campus.exam.rank.parent');
      // 呼叫 service。
      let rsp = await contract.send('_.getExamTotalWeightRank', { StudentID: this.currentStudent?.StudentID });
      console.log("teaache", rsp)

      // 裝
      this.currentStudentRankInto = new studentInfo()
      let rankInfoSource: RankInfoSource[] = [].concat(rsp.rs || []);
      rankInfoSource.forEach(rankInfo => {

        this.currentStudentRankInto?.addRankInfo(new RankInfo(rankInfo));
      })
      console.log("currentStudentRankInto", this.currentStudentRankInto)

      debugger
    } catch (err) {
      this.error = err;
      alert("取得排名發生錯誤!")
    } finally {
      this.loading = false;
    }
  }
  /**取得學生排名資料 */
  async getRankByStuRole() {
    try {
      this.loading = true;
      // 取得 contract 連線。
      const contract = await this.gadget.getContract('1campus.exam.rank.student');
      console.log("contract", contract)
      this.accessPoint = contract.getAccessPoint;
      // 呼叫 service。
      let rsp = await contract.send('_.getExamTotalWeightRank', {

      });
      console.log("rsp", rsp)
      // 裝
      this.currentStudentRankInto = new studentInfo()
      let rankInfoSource: RankInfoSource[] = [].concat(rsp.rs || []);
      rankInfoSource.forEach(rankInfo => {

        this.currentStudentRankInto?.addRankInfo(new RankInfo(rankInfo));
      })

    } catch (err) {
      this.error = err;
      alert("發生錯誤")
    } finally {
      this.loading = false;
    }
  }
  /** */
  getJSON(abs: any) {
    return JSON.stringify(abs);
  }
  /**get */
  getClassName(child: ChildInfo): string {
    debugger
    if (child.isSelected) {
      return ' ml-2  d-inline btn_color_select';
    } else {
      return 'ml-2  d-inline btn_color_noselect'
    }
  }
  /** */
  setSelectd(child: ChildInfo) {
    if (this.currentStudent) {
      this.currentStudent.isSelected = false;
    }
    child.isSelected = true;

  }
}
