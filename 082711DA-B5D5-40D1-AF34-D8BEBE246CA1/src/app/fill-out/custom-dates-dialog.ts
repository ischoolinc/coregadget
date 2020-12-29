import { WeekDay } from './../vo';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';




@Component({
  selector: "custom-dates-dialog",
  templateUrl: "custom-dates-dialog.html"

})
export class CustomDatesDialog {
  DATE_INFO = [
    "星期一"
    , "星期二"
    , "星期三"
    , "星期四"
    , "星期五"
    , "星期六"
  ]
  selectItem: string[];
  showItem: WeekDay[];
  periodNumber:number =1;
  constructor(
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CustomDatesDialog>,
    @Inject(MAT_DIALOG_DATA) public selectDates: string[]) {

    this.setView()
  }
  /**
   *loading
   *
   * @memberof CustomDatesDialog
   */
  setView() {
    this.showItem = [];
    this.DATE_INFO.forEach(dayName => {
      this.showItem.push(new WeekDay(dayName));
    });
  }
  CheckEnter(): void {


  }

  /**
   *取得日期
   *
   * @memberof CustomDatesDialog
   */
  GetSelectDates() {
    this.selectItem = [];
    this.showItem.forEach(item => {
      if (item.check) {
        this.selectItem.push(item.dayName);
      }
    });
  }

/**
 *
 *點選取消
 * @memberof CustomDatesDialog
 */
  exit()
  {
    this.dialogRef.close();
  }


  save(){
    this.selectDates = [];
    this.GetSelectDates();

    if(this.selectItem.length!== 0){

      this.dialogRef.close(
        {selectItem:this.selectItem
        ,RepeatPeriod :this.periodNumber
        }
        );
    }else
    {
      this._snackBar.open("請勾選選項!" ,"", {
        duration: 2000,
      })
    }
  }
}
