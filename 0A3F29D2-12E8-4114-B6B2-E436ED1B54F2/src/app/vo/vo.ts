export class RankInfo{
constructor(rankInfoSource :RankInfoSource){
 this.rank_type = rankInfoSource.rank_type ;
 this.rank_name =rankInfoSource.rank_name ;
 this.matrix_count = rankInfoSource.matrix_count ;
 this.rank = rankInfoSource.rank ;
}
  /**排名類型 */
  rank_type :string ="" ;
  /**排名 */
  rank :string ="";
  /** 排名母數*/
  matrix_count :string="";
  /**排名名稱 */
  rank_name :string="";


}

export  class studentInfo
{
  constructor()
  {
    this.RankInfos =[];
  }
    ref_student_id :string ="";
    /** */
    student_name :string ="";
    /** 班級名稱 */
    class_name:string ="";
    /** 座號 */
    seat_no :string ="";
    /**排名資訊 */
    RankInfos :RankInfo[];
    /**加入試別 */
    addRankInfo(rankInfo :RankInfo){
      this.RankInfos.push (rankInfo);
    }
    /** */
    hasRankInfo(name:string){

    }
}


/** 接抓回來的資料 */
export interface RankInfoSource{
  ref_student_id :string ;
  /** */
  student_name :string;
  /** 班級名稱 */
  class_name:string ;
  /** 座號 */
  seat_no :string ;
  /**排名類型 */
  rank_type :string ;
  /**排名 */
  rank :string ;
  /** 排名母數*/
  matrix_count :string;
  /**排名名稱 */
  rank_name :string;
  /** 試別ID */
  ref_exam_id :string ;

  /**科目名稱或 平均等等 */
  item_name :string ;


}

export interface ChildInfo
{
    StudentName:string ;
    StudentID :string ;
    StudentNumber:string;
    isSelected:boolean;

}


/**
 *
 * <rank_matrix_id>4154</rank_matrix_id>
	<score_type>定期評量</score_type>
	<score_category>總計成績</score_category>
	<item_name>加權總分</item_name>
	<rank_type>班排名</rank_type>
	<rank_name>國一1</rank_name>
	<class_name>國一1</class_name>
	<seat_no>1</seat_no>
	<student_number>00001</student_number>
	<student_name>王湘淇</student_name>
	<ref_student_id>793</ref_student_id>
	<score>2731</score>
	<rank>11</rank>
	<pr>72</pr>
	<percentile>26</percentile>
	<school_year>110</school_year>
 *
*/


export class  Exam {
constructor( examID :string ,examName :string ){
  this.examID = examID ;
  this.examName = examName ;
}
examID :string = "";
examName :string = "";
}

export class  SubjectInfo{
  constructor(subjectName :string ){

  this.subjectName = subjectName ;
  }

  subjectName


}


/**service : _.GetExamsAndSubjects */
export interface subjAndExamInfo{
  student_id :string ;
  student_name :string ;
  seat_no :string ;
  course_name :string ;
  subject :string ;
  template_name :string ;
  exam_name :string ;
  exam_id :string ;
  exam_display_order:string  ;
}
/*

<rs>
	<name>王湘淇</name>
	<seat_no>1</seat_no>
	<course_name>國一1 國文</course_name>
	<subject>國文</subject>
	<template_name>一般科目</template_name>
	<exam_name>第一次段考</exam_name>
	<exam_display_order>1</exam_display_order>
</rs>
*/




