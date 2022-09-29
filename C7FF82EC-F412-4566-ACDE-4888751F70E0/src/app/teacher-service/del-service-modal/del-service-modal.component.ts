import { Component, OnInit } from '@angular/core';
import { DsaService } from 'src/app/dsa.service';
import { ServiceItemDetail, ServiceItemInfo } from '../vo';

@Component({
  selector: 'app-del-service-modal',
  templateUrl: './del-service-modal.component.html',
  styleUrls: ['./del-service-modal.component.css']
})
export class DelServiceModalComponent implements OnInit {


  currentServiceInfo :ServiceItemInfo   
  constructor(private dsaService: DsaService) { }

  ngOnInit() {
    
  }

  async delService()
  { 
    try {
      debugger
    let resp = await this.dsaService.send("TeacherService.DelTeacherService", {
      Request: {
        ServiceUID: this.currentServiceInfo.ServiceID
      }
    });
    alert("刪除成功!")
    $("#delServiceModal").modal("hide");
  } catch (ex) {
    alert("刪除服務項目發生錯誤")
  }}

}
