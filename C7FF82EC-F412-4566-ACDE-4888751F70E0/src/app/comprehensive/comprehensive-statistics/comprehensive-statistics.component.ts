import { Component, OnInit, Optional, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { DsaService } from '../../dsa.service';
import { ComprehensiveComponent } from "../comprehensive.component";
import * as XLSX from 'xlsx';
import { CounselDetailComponent } from 'src/app/shared-counsel-detail';

@Component({
  selector: 'app-comprehensive-statistics',
  templateUrl: './comprehensive-statistics.component.html',
  styleUrls: ['./comprehensive-statistics.component.css']
})
export class ComprehensiveStatisticsComponent implements OnInit {

  isLoading: boolean;
  classList: any[];
  currentStatistics: any;

  @ViewChild("plugin")
  pluginEle: TemplateRef<any>;

  constructor(
    // private counselDetailComponent :CounselDetailComponent ,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dsaService: DsaService,
    public changeDetectorRef: ChangeDetectorRef,
    @Optional()
    public comprehensiveComponent: ComprehensiveComponent) { }

  ngOnInit() {
    this.comprehensiveComponent.currentMode = "statistics";
    this.comprehensiveComponent.changeDetectorRef.detectChanges();
    this.comprehensiveComponent.plugin = this.pluginEle;

    this.currentStatistics = {
      Name: "自訂輔導統計"
      , Target: [{
        OptionCode: "10000013"
        , Title: "蒙藏生"
      }, {
        OptionCode: "10000014"
        , Title: "大陸來台依親者"
      }, {
        OptionCode: "10000016"
        , Title: "港澳生"
      }, {
        OptionCode: "10000021"
        , Title: "派外人員子女"
      }]
    };
    this.getFillInDataStatistics();
  }

  async getFillInDataStatistics() {
    this.isLoading = true;
    this.classList = [].concat((await this.dsaService.send("GetFillInDataStatistics", {
      SchoolYear: this.comprehensiveComponent.currentSemester.SchoolYear
      , Semester: this.comprehensiveComponent.currentSemester.Semester
      , OptionCode: this.currentStatistics.Target.map(target => { return target.OptionCode })
    })).Class || []);

    this.classList.forEach(classRec => {
      classRec.OptionCode = [].concat(classRec.OptionCode || []);
      this.currentStatistics.Target.forEach(target => {
        classRec["OPT_" + target.Title] = classRec.OptionCode.map(opt => {
          if (opt.Code == target.OptionCode)
            return opt.Count;
          else
            return null;
        }).join("");
      });

      classRec.Student = [].concat(classRec.Student || []);
      classRec.Student.forEach(stuRec => {
        stuRec.OptionCode = [].concat(stuRec.OptionCode || []);
      });
    });

    this.isLoading = false;
  }

  // getClassOptionCount(classRec: any, optionCode: string) {
  //   return classRec.OptionCode.map(opt => {
  //     if (opt.Code == optionCode)
  //       return opt.Count;
  //     else
  //       return null;
  //   }).join("");
  // }

  save() {
    if (this.currentStatistics) {
      // Service 取得資料邏輯：
      // 1. 未結案個案：是否結案=f  and 個案建立日期 <= 畫面上所選年月
      // 2. 該月結案:是否結案=t and 結案日期 = 畫面上所選年月
      let fileName: string = this.currentStatistics.Name + "." + this.comprehensiveComponent.currentSemester.SchoolYear + this.comprehensiveComponent.currentSemester.Semester + ".xlsx";

      const wb = XLSX.utils.book_new();
      //班級統計
      {
        let data: any[] = [];
        let wsName: string = "班級統計";
        [].concat(this.classList || []).forEach(classRec => {
          var obj = {
            "年級": classRec.GradeYear
            , "班級": classRec.ClassName
            , "學生數": classRec.Count
          };
          this.currentStatistics.Target.forEach(target => {
            obj[target.Title] = classRec["OPT_" + target.Title];//this.getClassOptionCount(classRec, target.OptionCode);
          });
          data.push(obj);
        });

        const ws = XLSX.utils.json_to_sheet(data, { header: [], cellDates: true, dateNF: 'yyyy/mm/dd hh:mm:ss', });
        XLSX.utils.book_append_sheet(wb, ws, wsName);
      }
      //學生明細
      {
        let data: any[] = [];
        let wsName: string = "學生明細";
        [].concat(this.classList || []).forEach(classRec => {
          [].concat(classRec.Student || []).forEach(stuRec => {
            var obj = {
              "年級": classRec.GradeYear
              , "班級": classRec.ClassName
              , "座號": stuRec.SeatNo
              , "學號": stuRec.StudentNumber
              , "姓名": stuRec.Name
            };
            this.currentStatistics.Target.forEach(target => {
              obj[target.Title] = [].concat(stuRec.OptionCode || []).map(opt => {
                if (opt.Code == target.OptionCode && opt.Checked == "true")
                  return "true";
                else
                  return null;
              }).join("");
            });
            data.push(obj);
          });
        });

        const ws = XLSX.utils.json_to_sheet(data, { header: [], cellDates: true, dateNF: 'yyyy/mm/dd hh:mm:ss', });
        XLSX.utils.book_append_sheet(wb, ws, wsName);
      }
      //XLSX.write(wb,{type:'buffer',bookType:'xlsx'});
      XLSX.writeFile(wb, fileName);
    }
  }
}
