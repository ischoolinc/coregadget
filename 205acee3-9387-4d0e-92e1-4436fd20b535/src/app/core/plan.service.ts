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

  public async getSchoolYear() {
    await this.connect();
    return await this.contract.send('GetSchoolYear', {});
  }

  public async getPlans(year: string) {
    await this.connect();
    return await this.contract.send('GetPlans', { SchoolYear: year });
  }

  public async getAllPlans() {
    await this.connect();
    return await this.contract.send('GetAllPlans', {});
  }

  public async setPlanName(id: number, name: string) {
    await this.connect();
    return await this.contract.send('SetPlanName', { ID: id, Name: name });
  }

}
