import { DisciplineService, parseXmlDisciplineDetail, studentInfoDetail } from './../../dal/discipline.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent implements OnInit {

  selectedSeatNum: string;
  selectedId: string;
  selectedName: string;
  sortedStudentList = [];
  studentInfoTable: Map<string, studentInfoDetail[]> = new Map();
  sortedTable: Map<string, studentInfoDetail[]> = new Map();
  studentDetail: parseXmlDisciplineDetail[] = [];
  @ViewChild('table') table: ElementRef<HTMLDivElement>;

  constructor(private disciplineService: DisciplineService) { }

  async ngOnInit(): Promise<void> {
    this.selectedSeatNum = this.disciplineService.selectedSeatNum;
    this.selectedId = this.disciplineService.selectedStudentID;
    this.selectedName = this.disciplineService.selectedName;
    this.studentDetail = await this.disciplineService.getStudentDisciplineDetail(this.selectedId);
    await this.parseDetail();
  }

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

  getArray() {
    return Array.from(this.studentInfoTable);
  }

  getSemester(content:string) {
    const text = content.split('_');
    return `${text[0]}學年第${text[1]}學期`;
  }

  // 輸出成外部檔案(html/ xls)
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
                <th>警告</th>
                <th>留校察看</th>
                <th>原因</th>
                <th>銷過日期</th>
                <th>銷過原因</th>
                <th></th>
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
                    <td data-th="警告" >${detail.admonition}</td>
                    <td data-th="留校察看" >${detail.detention}</td>
                    <td data-th="原因" >${detail.reason}</td>
                    <td data-th="銷過日期" >${detail.delNegligenceDate}</td>
                    <td data-th="銷過原因" >${detail.delNegligenceReason}</td>
                    <td></td>
                </tr>`
      });
      end += `
            </tbody>
        </table>
      </div>`;
    })
    let innText = head + body + end;
    let html = `
    <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        </head>
        <body>
            <div>${this.selectedName}_${this.selectedId}_功過獎懲明細表</div>
            ${innText}
        </body>
    </html>`;
    const fileName = `${this.selectedName}_${this.selectedId}_功過獎懲明細表.${type}`;
    FileSaver.saveAs(new Blob([html], { type: "application/octet-stream" }), fileName);
  }

}
