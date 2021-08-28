import { CurrentItem, ICourseInfo } from './../vo/vo';
import { Injectable } from '@angular/core';
import { Subject ,Observable, BehaviorSubject, Subscription, fromEvent } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor() {

     // this.currentItem =new CurrentItem();
   }

  // public currentItem: CurrentItem =new CurrentItem() ;

  firstCurrentItem =new  CurrentItem();
  currentItem = new Subject<CurrentItem>();
  currentItem$ = this.currentItem.asObservable();
  /** 設定當前的學校*/
  // setCurrentCourse(currenCourse:ICourseInfo){
  //   if(this.currentItem){
  //     this.currentItem.selectedCourse = currenCourse ;

  //   }
  // }

  async setCurrentItem(currentItem :CurrentItem){
    this.firstCurrentItem =currentItem;
    this.currentItem.next(currentItem);
  }



  /**取得當前的學校 */
  getCurrentCourseItem (){
    return this.currentItem ;
  }

}
