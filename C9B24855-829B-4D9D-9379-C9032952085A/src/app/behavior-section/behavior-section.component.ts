import { Behavior } from './../vo/vo';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { GadgetService } from '../gadget.service';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorModalComponent } from '../behavior-modal/behavior-modal.component';

@Component({
  selector: 'app-behavior-section',
  templateUrl: './behavior-section.component.html',
  styleUrls: ['./behavior-section.component.scss']
})
export class BehaviorSectionComponent implements OnInit {
  courseID :string  |null | undefined ;
  loading =false ;
  error :any ={} ;
  behaviorRecordsList :Behavior[] =[];
  currentIndex :number|undefined;

  constructor(
    private gadget: GadgetService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(
      (params: ParamMap): void => {
        this.courseID = params.get("course_id");
        console.log("11", this.courseID );
        this.getBehaviorRecord();
      })


  }


  /**取得behavior的資料 */
  async getBehaviorRecord(){
    try {
      this.loading = true;
      // 取得 contract 連線。
      const contract = await this.gadget.getContract('1campus.esl.student');
      // 呼叫 service。
      let rsp  = await contract.send('GetBehaviorRecordByCourseID',  {
      CourseID:  this.courseID
      });

      console.log('behavior ', rsp);
      // 整理一下
     this.behaviorRecordsList= [].concat(rsp.BehaviorData) ;
     console.log("this.behaviorRecordsList",this.behaviorRecordsList);
    } catch (err) {
      this.error = err;
    } finally {
      this.loading = false;
    }
  }


   /**跳出 modal 視窗 */
  openBehaviorDetail(index :number){
      const dialogRef = this.dialog.open(BehaviorModalComponent, {
      width: '450px',
      data: { name: ""
            , BehaviorList: this.behaviorRecordsList
            , currentIndex: index}
    });
      console.log("behavior",index);
  }
}
