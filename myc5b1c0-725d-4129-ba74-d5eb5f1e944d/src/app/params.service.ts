import { Injectable } from '@angular/core';
import { GadgetParams } from './core/server.service';

@Injectable({
  providedIn: 'root'
})
export class ParamsService {

  private _params?: GadgetParams;

  constructor() { }

  public set allParams(params: GadgetParams) {
    this._params = params;
  }

  public get allParams(): GadgetParams {
    if(!this._params) { throw new Error('GadgetParams 未準備好就進行呼叫。');}
    return this._params!;
  }

  public get scheduleSource(): 'standard' | 'personal' {
    return this.allParams.schedule_source;
  }
}