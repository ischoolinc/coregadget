import { DisciplineService, parseXmlDisciplineDetail, studentInfoDetail } from './../../dal/discipline.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent implements OnInit {

  /**
   * 目前選擇的學生座號
   */
  selectedSeatNum: string;
  /**
   * 目前選擇的學生ID
   */
  selectedId: string;
  /**
   * 目前選擇的學生姓名
   */
  selectedName: string;
  /**
   * 學生獎懲明細(key: 學年度學期，value: 獎懲明細)
   */
  studentInfoTable: Map<string, studentInfoDetail[]> = new Map();
  /**
   * 學生ID查詢的獎懲明細
   */
  studentDetail: parseXmlDisciplineDetail[] = [];


  schoolType :string ="高中"
  @ViewChild('table') table: ElementRef<HTMLDivElement>;

  constructor(private disciplineService: DisciplineService) { }

  async ngOnInit(): Promise<void> {
    // 在入學制
    this.schoolType  =this.disciplineService.schoolType;

    // 抓取欲查詢學生明細
    this.getStudentInfo();
    this.studentDetail = await this.disciplineService.getStudentDisciplineDetail(this.selectedId);
    // 抓取非明細
    await this.parseDetail();
  }
  /**
   * 抓取本次查詢的學生明細
   */
  getStudentInfo() {
    this.selectedSeatNum = this.disciplineService.selectedSeatNum;
    this.selectedId = this.disciplineService.selectedStudentID;
    this.selectedName = this.disciplineService.selectedName;
  }
  /**
   * 解析學生明細 (key: 學年度學期， value: 獎懲明細)
   */
  parseDetail() {
    this.studentDetail.forEach((detail) => {
      const tableKey = `${detail.school_year}_${detail.semester}`;
      if (!this.studentInfoTable.get(tableKey)) {
        this.studentInfoTable.set(tableKey, []);
      }
      const tempDetail = this.studentInfoTable.get(tableKey);
      tempDetail.push(new studentInfoDetail(detail, this.selectedSeatNum, this.selectedName));
      this.studentInfoTable.set(tableKey, tempDetail);
    });
  }
  /**
   * convert studentInfoTable Map into array
   */
  getArray() {
    return Array.from(this.studentInfoTable);
  }
  /**
   *
   * @param content: xxx學年度_xxx學期
   */
  getSemester(content:string) {
    const text = content.split('_');
    return `${text[0]}學年 第${text[1]}學期`;
  }

  /**
   *
   * @param type 輸出成外部檔案(html/ xls)
   */
  exportFile(type: 'html' | 'xls'): void {

    // 重新繪製Html
    let head = `<div>
    <table border = 1>
        <thead>
            <tr>
                <th>學年度學期</th>
                <th>日期</th>
                <th>大功</th>
                <th>小功</th>
                <th>嘉獎</th>
                <th>大過</th>
                <th>小過</th>
                <th>警告</th>`;


                if( this.schoolType=="高中") // 如果會顯示
                {
                  head +=  `<th></th>`

                }
                head +=
                `
                <th>原因</th>
                <th>銷過日期</th>
                <th>銷過原因</th>
                <th>備註</th>
            </tr>
        </thead>
        <tbody>`;
    let body = '';
    let end = '';
    this.getArray().forEach((eachStudent) => {
      eachStudent[1].forEach((detail) => {
        body += `
                <tr>
                    <td data-th="學年度學期" >${this.getSemester(eachStudent[0])}</td>
                    <td data-th="日期" >${detail.date}</td>
                    <td data-th="大功" >${detail.majorMerit}</td>
                    <td data-th="小功" >${detail.minorMerit}</td>
                    <td data-th="嘉獎" >${detail.commendation}</td>
                    <td data-th="大過" >${detail.majorDemerit}</td>
                    <td data-th="小過" >${detail.minorDemerit}</td>
                    <td data-th="警告" >${detail.admonition}</td>`;

                    if(this.schoolType=="高中")
                    {
                      `<td data-th="留校察看" >${detail.detention}</td>`
                    }

                    body +=
                    `<td data-th="原因" >${detail.reason}</td>
                    <td data-th="銷過日期" >${detail.delNegligenceDate}</td>
                    <td data-th="銷過原因" >${detail.delNegligenceReason}</td>
                    <td data-th="備註">${detail.remark}</td>
                </tr>`
      });
      end += `
            </tbody>
        </table>
      </div>`;
    })
    let innerText = head + body + end;
    let html = `
    <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        </head>
        <body>
            <div>${this.selectedName}_${this.selectedId}_功過獎懲明細表</div>
            ${innerText}
        </body>
    </html>`;

    const fileName = `${this.selectedName}_${this.selectedId}_功過獎懲明細表.${type}`;
    FileSaver.saveAs(new Blob([html], { type: "application/octet-stream" }), fileName);
  }

  // stringTransform(content: string) {
  //   const tempString = content.split('&#x');
  //   const array = [];
  //   tempString.forEach((content) => {
  //     if (content !== '') {
  //       // 取得 unicode
  //       const specialWord = content.match('\\d{1,}');
  //       if (specialWord !== null) {
  //         array.push(...specialWord);
  //       }
  //       // 取得 中文字
  //       const normalWord = content.match('[\u4e00-\u9fa5]{1,}');
  //       if (normalWord !== null) {
  //         array.push(...normalWord);
  //       }
  //     }
  //   });
  //   // TODO:array內的 unicode值尚未處理



  //   return
  // }
}
