import { PeriodConf } from "./service/config.service";
import { Student, PeriodStatus, RollCallCheck } from "./service/dsa.service";

/** 學生點名狀態。 */
export class StudentCheck {

    private _periodConf: PeriodConf;
    private _stu: Student;
    private _status: PeriodStatus;
    private _isDirty: boolean;
    private _absenceRate :Number;
      showCurrentAbsType :string  ="";
      isMouseIn :boolean =false ;
    /**
     * 
     * @param stu 學生資料。
     * @param status 目前節次缺曠狀態。
     * @param acceptAbsence 節次設定。
     */
    constructor(stu: Student, status: PeriodStatus, acceptAbsence: PeriodConf) {
      this._stu = stu;
      this._status = status;
      this._periodConf = acceptAbsence;
      this._isDirty = false;
    }
  
    public get data() { return this._stu; }
  
    public get isDirty() { return }
  
    /** 缺曠資料是否允許調整。 */
    public acceptChange() {
  
      // 沒有指定任何缺曠的學生就可以變更。
      if(!this._status) return true;
  
      for(const absence of this._periodConf.Absence) {
        if(this._status.AbsenceType === absence.Name) return true;
      }
  
      return false;
    }
  
    public setAttendance(absence: string) {
  
      if (this._status) {
        if (this._status.AbsenceType === absence) {
          delete this._status;
        } else {
          this._status.AbsenceType = absence
        }
      } else {
        this._status = {
          '@text': 'xxx',
          'AbsenceType': absence
        }
      }
  
      this._isDirty = true;
    }
  
    public get status() {
      return this._status;
    }
  
    /** 取得可儲存的資料。 */
    public getCheckData(): RollCallCheck {
      if(this._status) {
        return {
          ID: this._stu.StudentID,
          Absence: this._status.AbsenceType
        }
      } else {
        return {
          ID: this._stu.StudentID,
          Absence: ''
        }
      }
    }

    public setAttenddacneRate( ansenceRate:number) 
    {
        this._absenceRate = ansenceRate;
    }

    /**滑鼠移進來時可以顯示 當前假別 */
    public setShowCurrentAbsent(currentAbsType :string )
    {
     this .showCurrentAbsType = currentAbsType;
    
    }


    public clearShowCurrentAbsent( )
    {
     this .showCurrentAbsType = "";
    
    }
  }