import { Component, OnInit, Optional } from '@angular/core';
import { AdminComponent } from "../admin.component";
import { ActivatedRoute, Router } from '@angular/router';
import { DsaService } from "../../dsa.service";

@Component({
  selector: 'app-counsel-teacher-role',
  templateUrl: './counsel-teacher-role.component.html',
  styleUrls: ['./counsel-teacher-role.component.css']
})
export class CounselTeacherRoleComponent implements OnInit {

  isLoading = false;
  teachersCounselRole: TeacherCounselRole[] = [];
  counselRole: string[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private dsaService: DsaService,
    private router: Router,
    @Optional()
    private adminComponent: AdminComponent) { }

  ngOnInit() {
    this.isLoading = true;
    this.adminComponent.currentItem = "counsel_teacher_role";
    this.counselRole = [];
    // 目前輔導身分counselRole
    this.counselRole.push('空白');
    this.counselRole.push('輔導主任');
    this.counselRole.push('輔導組長');
    this.counselRole.push('專任輔導');
    this.counselRole.push('兼任輔導');
    this.counselRole.push('認輔老師');

    this.loadData();
  }

  save() {
    this.SetTeachersCounselRole();
  }

  loadData() {
    // 載入輔導身分
    this.GetTeachersCounselRole();
    this.isLoading = false;
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

  // 取得所有教師輔導身分
  async GetTeachersCounselRole() {
    this.teachersCounselRole = [];
    let resp = await this.dsaService.send("GetTeachersCounselRole", {
      Request: {}
    });

    [].concat(resp.TeacherCounselRole || []).forEach(CounselRole => {
      let tea: TeacherCounselRole = new TeacherCounselRole();
      tea.TeacherID = CounselRole.TeacherID;
      tea.TeacherName = CounselRole.TeacherName;
      tea.Role = CounselRole.Role;
      this.teachersCounselRole.push(tea);
    });
  }

  // 批次設定教師角色
  async SetTeachersCounselRole() {
    let reqTeacherCounselRole = [];
    this.teachersCounselRole.forEach(tea =>{
      if (tea.isChage)
      {
        let itItm = {
          TeacherID: tea.TeacherID,
          Role: tea.Role
        }
        reqTeacherCounselRole.push(itItm);
      }
    }); 
    let resp = await this.dsaService.send("SetTeachersCounselRole", {
      Request: {TeacherCounselRole:reqTeacherCounselRole}
    });
 
    console.log(resp);   
  }
}

export class TeacherCounselRole {
  constructor() { }
  TeacherID: string;
  Role: string;
  TeacherName: string;
  isChage: boolean = false;
}
