import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AddDialogComponent } from './add-dialog.component';
import { BasicService } from '../service/basic.service';
import { SubjectRecord, WishRecord } from "../data/index";

@Component({
  selector: 'app-add-wish',
  templateUrl: './add-wish.component.html',
  styles: []
})
export class AddWishComponent implements OnInit {

  loading: boolean = true;
  // 課程時段
  subjectType: string;
  // 學生志願序清單
  wishList: WishRecord[] = [];
  // 課程清單
  subjectList: SubjectRecord[] =[];

  Tooltip = "推算第一輪志願分發狀況\n 1. 自行評估選上的機率\n 2. 避免後面志願選填必定額滿的課程";

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private basicSrv: BasicService
  ) {}

  async ngOnInit() {
    try {
      // 取得課程時段
      this.subjectType = this.route.snapshot.paramMap.get("subjectType");
      await this.getData();
    } catch(err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  /**取得該課程時段選課資料 */
  async getData() {
    const rsp = await this.basicSrv.getSubjectListByType({ SubjectType: this.subjectType });
    this.wishList = rsp.WishList;
    this.subjectList = rsp.SubjectList;
  }

  /**志願選填 */
  async setWish() {
    const rsp = await this.basicSrv.setWish({ SubjectType: this.subjectType, Wish: this.wishList });
    if(rsp.Result === 'success') {
      this.getData();
    } else {
      alert("SetWish error: 資料儲存失敗!");
    }
  }

  /**刪除志願 */
  removeItem(subject: WishRecord) {
    var index = this.wishList.indexOf(subject);
    if (index >= 0) {
      this.wishList.splice(index, 1);
      // 重新設定志願序
      this.wishList.forEach((wish: WishRecord, index: number) => {
        wish.WishOrder = index + 1;
      });

      this.setWish();
    }
  }

  /**志願往下 */
  moveDown(subject: WishRecord) {
    subject.WishOrder = Number(subject.WishOrder) + 1.5;
    this.wishList.sort((a: WishRecord, b: WishRecord) => a.WishOrder - b.WishOrder);
    this.wishList.forEach((wish: WishRecord, index: number) => {
      wish.WishOrder = index + 1;
    });

    this.setWish();
  }

  /**志願往下 */
  moveUp(subject: WishRecord) {
    subject.WishOrder = Number(subject.WishOrder) - 1.5;
    this.wishList.sort((a: WishRecord, b: WishRecord) => a.WishOrder - b.WishOrder);
    this.wishList.forEach((wish: WishRecord, index: number) => {
      wish.WishOrder = index + 1;
    });

    this.setWish();
  }

  /**加入志願 */
  joinCourse(subject: any) {
    const wish = this.wishList.find((wish: WishRecord) => wish.SubjectID === subject.SubjectID);

    if (!wish && this.wishList.length < 5) {
      this.wishList.push(subject);
      this.wishList.forEach((wish: WishRecord, index: number) => {
        wish.WishOrder = index + 1;
      });
      this.setWish();
    } 
  }

  /**顯示選課科目資料 */
  showDialog(subject: SubjectRecord, mode: string) {
    const dig = this.dialog.open(AddDialogComponent, {
      data: { subject: subject, mode: mode, countMode: '志願序' }
    });

    dig.afterClosed().subscribe((v) => {
      if (v && v.subject) {
        this.joinCourse(v.subject);
      }
    });
  }

}