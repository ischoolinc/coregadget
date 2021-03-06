import { Injectable } from "@angular/core";
import { DsaService } from "./dsa.service";

@Injectable({
  providedIn: "root"
})
export class RoleService {
  private _role: string[];

  private _isLoading: boolean;
  private _enableCounsel: boolean = false;
  private _enableCounselStatistics: boolean = false;
  private _enableReferral: boolean = false;
  private _enableCase: boolean = false;
  private _enableInterviewStatistics: boolean = false;
  private _enableAdmin: boolean = false;
  private _enableComprehensive: boolean = false;
  private _enablePsychologicalTest: boolean = false;

  public get isLoading() {
    return this._isLoading;
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
  public get enableAdmin() {
    return this._enableAdmin;
  }
  public get role() {
    return this._role;
  }

  constructor(private dsaService: DsaService) {
    this.reload();
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
      this._role.indexOf("輔導老師") >= 0 ||
      this._role.indexOf("認輔老師") >= 0 ||
      this._role.indexOf("班導師") >= 0
    ) {
      this._enableCounsel = true;
    }
    if (
      this._role.indexOf("管理者") >= 0 
    ) {
      this._enableCounselStatistics = true;
    }
    if (
      this._role.indexOf("管理者") >= 0 ||
      this._role.indexOf("輔導老師") >= 0
    ) {
      this._enableReferral = true;
    }
    if (
      this._role.indexOf("管理者") >= 0 ||
      this._role.indexOf("輔導老師") >= 0
    ) {
      this._enableCase = true;
    }
    if (
      this._role.indexOf("管理者") >= 0 ||
      this._role.indexOf("輔導老師") >= 0 ||
      this._role.indexOf("認輔老師") >= 0
    ) {
      this._enableInterviewStatistics = true;
    }

    if (
      this._role.indexOf("管理者") >= 0 ||
      this._role.indexOf("輔導老師") >= 0
    ) {
      this._enableComprehensive = true;
    }

    if (
      this._role.indexOf("管理者") >= 0 ||
      this._role.indexOf("輔導老師") >= 0
    ) {
      this._enablePsychologicalTest = true;
    }

    if (
      this._role.indexOf("管理者") >= 0
    ) {
      this._enableAdmin = true;
    }

    // 未開發功能不能用
    this._enableInterviewStatistics = false;

    this._isLoading = false;
  }
}
