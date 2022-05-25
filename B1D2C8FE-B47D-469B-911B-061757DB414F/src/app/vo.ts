
/** 接資料 */
export interface TeacherInfo {
  classid: string ,
  classname: string ,
  gender: string ,
  linkaccount: string ,
  nickname: string ,
  perfix: string ,
  tag_name: string ,
  tag_teacher_id: string ,
  teachercode: string ,
  teacherid: string ,
  teachername: string ,
  teacherstatus: string,
  email: string

}


export interface TeacherRec {
  TeacherId: string;
  TeacherName: string;
  Nickname: string;
  Gender: string;
  TeacherStatus: string;
  LinkAccount: string;
  TeacherCode: string;
  Classes: ClassRec[];
  Checked :boolean;
  TagPrefix :TagTeacherInfo[];
  /** 顯示用 tag */
  TagString?:string ;
  isEdit :string
}

export interface ClassRec {
  ClassId: string;
  ClassName: string;
}
/** 刪除 tag 時會用到  */
export interface TagTeacherInfo {
  prefix: string ;
  /** teacherTag 的ID  */
  ID : string ;
  TagName : string;
  isDeleted :boolean ;
  }




