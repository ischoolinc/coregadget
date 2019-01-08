import { Injectable } from '@angular/core';
import { DsaService } from "./dsa.service";

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private _role: string[];

  private _isLoading: boolean;
  private _enableCounsel: boolean;
  private _enableCounselStatistics: boolean;
  private _enableReferral: boolean;
  private _enableCase: boolean;
  private _enableInterviewStatistics: boolean;

  public get isLoading() { return this._isLoading; }
  public get enableCounsel() { return this._enableCounsel; }
  public get enableCounselStatistics() { return this._enableCounselStatistics; }
  public get enableReferral() { return this._enableReferral; }
  public get enableCase() { return this._enableCase; }
  public get enableInterviewStatistics() { return this._enableInterviewStatistics; }
  public get role() { return this._role; }

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

    if (this._role.indexOf("輔導老師") >= 0
      || this._role.indexOf("認輔老師") >= 0
      || this._role.indexOf("班導師") >= 0) {
      this._enableCounsel = true;
    }
    if (this._role.indexOf("班導師") >= 0) {
      this._enableCounselStatistics = true;
    }
    if (this._role.indexOf("管理者") >= 0
      || this._role.indexOf("輔導老師") >= 0) {
      this._enableReferral = true;
    }
    if (this._role.indexOf("管理者") >= 0
      || this._role.indexOf("輔導老師") >= 0) {
      this._enableCase = true;
    }
    if (this._role.indexOf("管理者") >= 0
      || this._role.indexOf("輔導老師") >= 0
      || this._role.indexOf("認輔老師") >= 0) {
      this._enableInterviewStatistics = true;
    }
    this._isLoading = false;
  }
}
