import { Injectable } from '@angular/core';
import { GadgetService } from './gadget.service';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private contract: any;

  constructor(
    private gadget: GadgetService
  ) {
  }

  async connect() {
    if (!this.contract) {
      this.contract = await this.gadget.getContract('1campus.graduation_plan');
    }
  }

  // public async getSchoolYear() {
  //   await this.connect();
  //   return await this.contract.send('GetSchoolYear', {});
  // }

  // public async getPlans(year: string) {
  //   await this.connect();
  //   return await this.contract.send('GetPlans', { SchoolYear: year });
  // }

  public async getAllPlans() {
    await this.connect();
    return await this.contract.send('GetAllPlans', {});
  }

  public async setPlanName(id: number, name: string) {
    await this.connect();
    return await this.contract.send('SetPlanName', {Request: { ID: id, Name: name }});
  }

  public async setPlanContent(id: number, content: string) {
    await this.connect();
    return await this.contract.send('SetPlanContent', { ID: id, Content: `${content}`});
  }

  public async setPlanGroupCode(ID: number, Code: string, Code1: string, Content: string) {
    await this.connect();
    return await this.contract.send('SetPlanGroupCode', { ID, Code, Content, Code1});
  }

  public async newPlan(name: string, content: string) {
    await this.connect();
    return await this.contract.send('NewPlan', {Request: { Name: name, Content: `${content}`}});
  }

  public async removePlan(id: number) {
    await this.connect();
    return await this.contract.send('RemovePlan', {ID: id});
  }

  public async getMoeGroupCode() {
    await this.connect();
    return await this.contract.send('GetMoeGroupCode', {});
  }

}
