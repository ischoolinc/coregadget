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
    // this.ref_student_id = rankInfoSource.ref_student_id ;
    // this.student_name = rankInfoSource.student_name ;
    // this.class_name = rankInfoSource.class_name ;
    // this.student_name =rankInfoSource.student_name ;
    // this.seat_no =rankInfoSource.seat_no;
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
