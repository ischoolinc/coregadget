import { Injectable } from "@angular/core";
import { ITeacher } from "./case/vo";
import { DsaService } from "./dsa.service";

@Injectable({
  providedIn: "root"
})
export class RoleService {

  private _loginTeacher  :ITeacher 
  private _loginTeacherName ="" ;
  private _role: string[];

  private _isLoading: boolean;
  private _enableCounsel: boolean = false;
  /** �έp��T �֥i�H��*/
  private _enableCounselStatistics: boolean = false;
  private _enableReferral: boolean = false;
  private _enableCase: boolean = false;
  private _enableInterviewStatistics: boolean = false;
  private _enableAdmin: boolean = false;
  private _enableComprehensive: boolean = false;
  private _enablePsychologicalTest: boolean = false;
  /** �����A�ȥi�_�ϥ� */
  private _enableTeacherService: boolean = false;

  public get isLoading() {
    return this._isLoading;
  }
  /** ���o�ثe�Юv��� */
  public get loginTeacher(){
    
    return this._loginTeacher ;
   }
   
  /** ���o�ثe�n�J�Юv���S */
  public get loginTeacherName()
  {
  return this._loginTeacherName;
  }


  public get enableCounsel() {
    return this._enableCounsel;
  }
  public get enableCounselStatistics() {
    return this._enableCounselStatistics;
  }

  public get enableReferral() {
    return this._enableReferral;
  }
  public get enableCase() {
    return this._enableCase;
  }
  public get enableInterviewStatistics() {
    return this._enableInterviewStatistics;
  }
  public get enableComprehensive() {
    return this._enableComprehensive;
  }
  public get enablePsychologicalTest() {
    return this._enablePsychologicalTest;
  }

  public get enableTeacherService(){

    return  this._enableTeacherService
  }

  public get enableAdmin() {
    return this._enableAdmin;
  }
  public get role() {
    return this._role;
  }

  constructor(private dsaService: DsaService) {
    this.reload();
    this.loadLoginTeacherData();
  }

  async reload() {

    this._isLoading = true;
    let resp = await this.dsaService.send("GetRole", {});

    this._enableCounsel = false;
    this._enableCounselStatistics = false;
    this._enableReferral = false;
    this._enableCase = false;
    this._enableInterviewStatistics = false;

    this._role = [].concat(resp.Role || []);

    if (
      this._role.indexOf("���ɦѮv") >= 0 ||
      this._role.indexOf("�{���Ѯv") >= 0 ||
      this._role.indexOf("�Z�ɮv") >= 0
    ) {
      this._enableCounsel = true;
    }
    if (
      this._role.indexOf("�޲z��") >= 0 
    ) {
      this._enableCounselStatistics = true;
    }
    if (
      this._role.indexOf("�޲z��") >= 0 ||
      this._role.indexOf("���ɦѮv") >= 0
    ) {
      this._enableReferral = true;
    }
    if (
      this._role.indexOf("�޲z��") >= 0 ||
      this._role.indexOf("���ɦѮv") >= 0
    ) {
      this._enableCase = true;
    }
    if (
      this._role.indexOf("�޲z��") >= 0 ||
      this._role.indexOf("���ɦѮv") >= 0 ||
      this._role.indexOf("�{���Ѯv") >= 0 
      // this._role.indexOf("�ե~�߲z�v") >= 0 

    ) {
      this._enableInterviewStatistics = true;
    }

    if (
      this._role.indexOf("�޲z��") >= 0 ||
      this._role.indexOf("���ɦѮv") >= 0
    ) {
      this._enableComprehensive = true;
    }

    if (
      this._role.indexOf("�޲z��") >= 0 ||
      this._role.indexOf("���ɦѮv") >= 0
    ) {
      this._enablePsychologicalTest = true;
    }

    if (
      this._role.indexOf("�޲z��") >= 0
    ) {
      this._enableAdmin = true;
    }

//  alert(JSON.stringify(this._loginTeacher))
    if( this._role.indexOf("�޲z��") >= 0 ||
    this._role.indexOf("���ɦѮv") >= 0 ||
    this._loginTeacher.Role =="�ե~�߲z�v" ||
    this._loginTeacher.Role =="�ݥ�����" ||
    this._loginTeacher.Role =="�{���Ѯv" ||
    this._role.indexOf("�{���Ѯv") >= 0 ){
      this._enableTeacherService =true ;
    }



    // ���}�o�\�ण���
    this._enableInterviewStatistics = false;

    this._isLoading = false;
  }


  /** ���o   */
  async loadLoginTeacherData() {

    // ���o�n�J�Юv�W��
    let teacher = await this.dsaService.send("GetTeacher", {});
    [].concat(teacher.Teacher || []).forEach(tea => {
      this._loginTeacherName = tea.Name;
      this._loginTeacher =tea ;
    });
  }
}
