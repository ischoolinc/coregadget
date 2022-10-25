
 /** 服務項目 with detail */
export  interface  ServiceDetailDB  {
	// <service_id>5361474</service_id>
	// <service_date>2022-09-20 00:00:00</service_date>
	// <description>描述</description>
	// <service_item>團體服務</service_item>
	// <service_target>六年級</service_target>
	// <gender>女</gender>
	// <count>3</count>
	// <ref_teacher_id>27</ref_teacher_id>

 
    // 服務項目uid 
    service_id :string  
    /** 服務項目日期 */
    service_date
    /** 服務項目*/
    service_item
    /** 服務對象  */
    service_target
    /** 性別 */
    gender
    /** 教師 id */
    ref_teacher_id
    /** 數量 */
    count
    /** 描述 */
    description
    /** 其他服務項目細節 */
    service_item_other_detail
    /**個案晤談紀錄ID */  
    case_interview_id
}

/** 服務項目 */
export class ServiceItemInfo {
constructor(serviceDetailDB :ServiceDetailDB = null){
    if(serviceDetailDB){
        this.ServiceID = serviceDetailDB.service_id ;
        this.ServiceItem = serviceDetailDB.service_item;
        this.ServiceDate = serviceDetailDB.service_date ||'' ;
        this.ServiceDescription = serviceDetailDB.description ;
        this.OtherServiceDetail =serviceDetailDB.service_item_other_detail
        this.CaseInterviewID = serviceDetailDB.case_interview_id
        this.targetDetailList =[];
    }
}
/** 服務 ID */
ServiceID :string ;
/**  服務日期*/
ServiceDate :string ="";
/**  服務項目*/
ServiceItem :string ;
/** 服務項目對象 */
targetDetailList :ServiceItemDetail[] = [];
/** 教師代號 */
ref_teacher_id :string ;
/** 描述 */
ServiceDescription :string ="";
/** 其他說明 */
OtherServiceDetail =""

/** */
DetailDisplayString :string ="";

/** 如果是從二級個案晤談紀錄來的資料*/
CaseInterviewID  :string  = "" ;

/** 加入  */
addTargetDetail(detail:ServiceDetailDB){
  let serviceDetail = new ServiceItemDetail(detail) ;
  this.targetDetailList.push(serviceDetail);

}

/**   */
getTargetDetailString (){

   this.DetailDisplayString ='';
   this.targetDetailList.forEach(x=>{
   this.DetailDisplayString += `${x.ServiceTarget}(${x.gender}) 、` 

})
return    this.DetailDisplayString 
}
}

/** 服務項目細節*/
export class ServiceItemDetail{
    constructor(serviceDetailDB : ServiceDetailDB = null ) {
        if(serviceDetailDB){

            this.ServiceTarget  = serviceDetailDB.service_target ;
            this.gender =  serviceDetailDB.gender ;
            this.peopleCount = serviceDetailDB.count ;
      
        }

    }
    /** 對象 */
    ServiceTarget :string ;
    /** 性別 */
    gender : string ;
    /** 數量 */
    peopleCount : number = 1 ;

    /**  修改時判斷動作  */
    Action? : 'delete' | 'add'

}

/**目前模式 */
export class mode {
    mode :'view' |'edit' |'add' ='view' ;
    isViewMode()
    {
        return this.mode == 'view'
    }
    isEditMode(){
        return this.mode == 'edit'
    }
    isAddMode(){
        return this.mode == 'add'
    }
}

