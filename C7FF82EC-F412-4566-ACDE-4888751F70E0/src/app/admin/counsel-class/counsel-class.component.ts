import { Component, OnInit, Optional, ViewChild } from '@angular/core';
import { AdminComponent } from "../admin.component";
import { ActivatedRoute, Router } from '@angular/router';
import { DsaService } from "../../dsa.service";
import { AddCounselTeacherModalComponent } from "./add-counsel-teacher-modal/add-counsel-teacher-modal.component";
import { CounselTeacherClass } from './counsel-class-vo';
@Component({
  selector: 'app-counsel-class',
  templateUrl: './counsel-class.component.html',
  styleUrls: ['./counsel-class.component.css']
})
export class CounselClassComponent implements OnInit {
  isLoading = false;
  counselTeacherClassList: CounselTeacherClass[] = [];
  @ViewChild("addCounselTeacher") _addCounselTeacher: AddCounselTeacherModalComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dsaService: DsaService,
    @Optional()
    private adminComponent: AdminComponent) { }

  ngOnInit() {
    this.adminComponent.currentItem = "counsel_class";
    this.loadData();
  }

  // 取得教師輔導班級
  async GetCounselTeacherClass() {
    this.counselTeacherClassList = [];
    let resp = await this.dsaService.send("GetCounselTeacherClass", {
      Request: {}
    });

    [].concat(resp.CounselTeacher || []).forEach(CounselTeacher => {
      let tea: CounselTeacherClass = new CounselTeacherClass();
      tea.TeacherID = CounselTeacher.TeacherID;
      tea.TeacherName = CounselTeacher.TeacherName;
      tea.Role = CounselTeacher.Role;
      tea.ClassNames = CounselTeacher.ClassNames;
      this.counselTeacherClassList.push(tea);
    });

    this.isLoading = false;
  }

  loadData() {
    this.isLoading = true;
    // 載入輔導身分
    this.GetCounselTeacherClass();

    
  }

  // 編輯班級資料
  EditClassNames(item: CounselTeacherClass) {    
    this._addCounselTeacher._CounselTeacherClass = item;
    this._addCounselTeacher.filterCheckBox();
   
    $("#addCounselTeacher").modal("show");

    // 關閉畫面
    $("#addCounselTeacher").on("hide.bs.modal", () => {
      // 重整資料
      this.loadData();
      $("#addCounselTeacher").off("hide.bs.modal");
    });

  }
}


