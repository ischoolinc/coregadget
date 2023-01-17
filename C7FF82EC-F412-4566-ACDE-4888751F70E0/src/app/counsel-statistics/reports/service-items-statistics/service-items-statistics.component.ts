import { Component, OnInit } from '@angular/core';
import { DsaService } from 'src/app/dsa.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-service-items-statistics',
  templateUrl: './service-items-statistics.component.html',
  styleUrls: ['./service-items-statistics.component.css']
})
export class ServiceItemsStatisticsComponent implements OnInit {

  selectYear: number;
  selectMonth: number;
  buttonDisable :boolean  = false ;
  constructor( private dsaService: DsaService) { }

  ngOnInit() {

    // 年,月 初始化
    this.selectYear = new Date().getFullYear();
    this.selectMonth = new Date().getMonth() + 1;
  }

  /** 產生報表 */
  async exportRepot(item) {

    let resp = await this.dsaService.send("Statistics.GetServiceItemsByMonth", {
      Request: {
        Year: this.selectYear,
        Month: this.selectMonth,
      }
    });
    console.log('statics service ',resp)

    // let rsp = [].concat(resp)

  let  serviceItemData :any[] = [].concat(resp.rs)


  let data  = []; 
    //	<teacher_name>史慈芬</teacher_name>
	// <teacher_report_role>專任輔導教師</teacher_report_role>
	// <teacher_counsel_number/>
    
  serviceItemData.forEach (  item => {
      let printItem =  {
        '教師編號' : item.teacher_counsel_number || ('未設教師編號'), 
        
        '教師姓名' : item.nickname? item.teacher_name +'-' +item.nickname :item.teacher_name ,

        '教師身分' : item.teacher_counsel_number ,

        '晤談記錄編號' : item.case_interview_id ,

        '描述' : item.description ,
        
        '服務日期' :  item.service_date,

        '服務項目':  item.service_item ,

        '服務對象' : item.service_target ,

        '性別' :item.gender ,

        '人次' : item.count ,
        
        '其他服務項目' : item.service_item_other_detail


      } ;

     data.push(printItem) ;

    });

    console.log('data',data);
    const wb = XLSX.utils.book_new();
    // var ws = XLSX.utils.aoa_to_sheet(data);
    // var ws = XLSX.utils.aoa_to_sheet([]);
    const ws = XLSX.utils.json_to_sheet(data, { header: [], cellDates: true, dateNF: 'yyyy-mm-dd hh:mm:ss', });
    XLSX.utils.book_append_sheet(wb, ws, '服務項目');
  
    XLSX.writeFile(wb, '服務項目統計報表'+".xlsx");
  }
}
