/** 教師資料(目前教師) */
export interface  ITeacher{
/* example   
ID: "104"
Name: "普102測試教師"
NickName: ""
*/

/** 教師ID*/
ID :string 
/** 班級 ID */
Name :string 
/** 班級名稱 */ 
NickName: string 
/** 系統角色  */ 
Role : string 

/**  */
interviewEnable? :boolean ;

} 