export interface RollCallRateDenominator
{
 courseID :string ;
 IsUseWeeks :string ;
 
 /**
  *
  * 上課週數
  * @type {string}
  * @memberof RollCallRateDenominator
  */
  DefaultWeeks:string;
 
 /**
  *
  * 上課週數 (整個學校的預設值)
  * @type {string}
  * @memberof RollCallRateDenominator
  */
 WeeksFromCourse :string ;
 /**
  *
  * 每週上課節數
  * @memberof RollCallRateDenominator
  */
 Period : string ;

 /**
  *
  * 從課程設定的上課週數算出的母數
  * @type null
  * @memberof RollCallRateDenominator
  */
 CourseDe :string ;

 /**
  * 預設上課週數
  * @type {string}
  * @memberof RollCallRateDenominator
  */
 DefaultDe :string ;

 /**
  *
  * 實際點名次數
  * @type {string}
  * @memberof RollCallRateDenominator
  */
 ActualRollcallTime :string ; 

 /**
  * 課程上的設定週數
  */
 WeekCount :string ;
}