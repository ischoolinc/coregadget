/** DB entity   */
export interface StudentAttendance {
//   <rs>
// 	<id>194</id>
// 	<name>王志佩</name>
// 	<student_number>060101</student_number>
// 	<seat_no>1</seat_no>
// 	<freshman_photo>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</freshman_photo>
// 	<class_name>101</class_name>
// 	<detail/>
// 	<period>一</period>
// 	<absence/>
// </rs>
/** 學生ID  */
id : string ;
/** 學生姓名  */
name :string ;
/** 學號 */
student_number :string ;
/** 座號 */
seat_no :string ;
/** 照片 */
freshman_photo :string ;
/** 班級名稱  */
class_name :string ;
/**  */
detail :string  ;
/**  */
period :string ;
/**  */
absence :string ;
course_name :string ;
now_attendance_absence_type :string ;
now_attendance_period :string;
}



/** 學生資訊  */
export interface Student{
  /** 學生ID */
 student_id : string ;
 /** 學生姓名 */
 student_name : string ;
 /** 座號 */
 seat_no : string ;
}
