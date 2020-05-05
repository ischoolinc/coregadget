import { Component, OnInit, Optional, ViewChild } from '@angular/core';
import { AdminComponent } from "../admin.component";
import { ActivatedRoute, Router } from '@angular/router';
import { DsaService } from "../../dsa.service";
import { Alert } from 'selenium-webdriver';
import { TeacherCounselRole } from "./counsel-teacher-role-vo";
import { AddCounselTeacherRoleModalComponent } from "./add-counsel-teacher-role-modal/add-counsel-teacher-role-modal.component";
import { DelCounselTeacherRoleModalComponent } from "./del-counsel-teacher-role-modal/del-counsel-teacher-role-modal.component";

@Component({
  selector: 'app-counsel-teacher-role',
  templateUrl: './counsel-teacher-role.component.html',
  styleUrls: ['./counsel-teacher-role.component.css']
})
export class CounselTeacherRoleComponent implements OnInit {
  public teacherTypeStr: string = "教師輔導身分";
  isLoading = false;
  teachersCounselRole: TeacherCounselRole[] = [];
  notTeachersCounselRole: TeacherCounselRole[] = [];
  counselRole: string[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private dsaService: DsaService,
    private router: Router,
    @Optional()
    public adminComponent: AdminComponent) { }


  @ViewChild("addCounselTeacherRole") _addCounselTeacherRole: AddCounselTeacherRoleModalComponent;
  @ViewChild("delCounselTeacherRole") _delCounselTeacherRole: DelCounselTeacherRoleModalComponent;

  ngOnInit() {
    this.teacherTypeStr = "教師輔導身分";
    setTimeout(() => { this.adminComponent.currentItem = "counsel_teacher_role"; });

    if (gadget.params.system_counsel_position === 'freshman') {
      this.teacherTypeStr = "教師身分";
    }

    this.counselRole = [];
    // 目前輔導身分counselRole    
    this.counselRole.push('輔導主任');
    this.counselRole.push('輔導組長');
    this.counselRole.push('專任輔導');
    this.counselRole.push('兼任輔導');
    this.counselRole.push('認輔老師');

    this.loadData();
  }

  Add() {
    this._addCounselTeacherRole.counselRole = this.counselRole;
    // 填入老師姓名
    this._addCounselTeacherRole.options = [];
    this._addCounselTeacherRole.selectTeacherID = "";
    this._addCounselTeacherRole.myControl.setValue('');
    this.notTeachersCounselRole.forEach(item => {
      this._addCounselTeacherRole.options.push(item.TeacherName);
    });

    this._addCounselTeacherRole.selectRole = "請選擇身分";
    this._addCounselTeacherRole.selectTeacherName = "請選擇教師";
    this._addCounselTeacherRole.notTeachersCounselRole = this.notTeachersCounselRole;
    this._addCounselTeacherRole.isSaveButtonDisable = true;
    $("#addCounselTeacherRole").modal("show");

    // 關閉畫面
    $("#addCounselTeacherRole").on("hide.bs.modal", () => {
      // 重整資料
      if (!this._addCounselTeacherRole.isCancel)
        this.loadData();
      $("#addCounselTeacherRole").off("hide.bs.modal");
    });
  }

  loadData() {
    this.isLoading = true;
    // 載入輔導身分
    this.GetTeachersCounselRole();

  }

  // 設定教師角色
  SetTeacherRole(name: string, teacher: TeacherCounselRole) {
    let roleName = '';
    if (name != '空白') {
      roleName = name;
    }
    teacher.Role = roleName;
    teacher.isChage = true;
  }

  delete(item: TeacherCounselRole) {

    this._delCounselTeacherRole.teacherCounselRole = item;
    $("#delCounselTeacherRole").modal("show");

    // 關閉畫面
    $("#delCounselTeacherRole").on("hide.bs.modal", () => {
      // 重整資料
      if (!this._delCounselTeacherRole.isCancel)
        this.loadData();
      $("#delCounselTeacherRole").off("hide.bs.modal");
    });
  }

  // 取得所有教師輔導身分
  async GetTeachersCounselRole() {
    this.teachersCounselRole = [];
    this.notTeachersCounselRole = [];

    try {
      let resp = await this.dsaService.send("GetTeachersCounselRole", {
        Request: {}
      });

      [].concat(resp.TeacherCounselRole || []).forEach(CounselRole => {
        let tea: TeacherCounselRole = new TeacherCounselRole();
        tea.TeacherID = CounselRole.TeacherID;
        tea.TeacherName = CounselRole.TeacherName;
        tea.Role = CounselRole.Role;
        tea.parseOrder();
        if (tea.Role && tea.Role !== '') {
          this.teachersCounselRole.push(tea);
        } else {
          this.notTeachersCounselRole.push(tea);
        }
      });

      this.teachersCounselRole.sort(function (a, b) {
        return a.Order - b.Order;
      });
    } catch (err) {
      alert('無法取得輔導教師身分：' + err.dsaError.message);
    }

    this.isLoading = false;
  }

  // 批次設定教師角色
  async SetTeachersCounselRole() {
    let reqTeacherCounselRole = [];
    this.teachersCounselRole.forEach(tea => {
      if (tea.isChage) {
        let itItm = {
          TeacherID: tea.TeacherID,
          Role: tea.Role
        }
        reqTeacherCounselRole.push(itItm);
      }
    });
    try {
      let resp = await this.dsaService.send("SetTeachersCounselRole", {
        Request: { TeacherCounselRole: reqTeacherCounselRole }
      });
    } catch (err) {
      alert('無法設定輔導教師身分：' + err.dsaError.message);
    }
    //console.log(resp);
  }
}


