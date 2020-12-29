import { Injectable } from '@angular/core';
import { GadgetService } from './gadget.service';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  contactName = '1campus.mobile.v2.teacher';
  TAcontactName = 'ta';

  constructor(
    private gadget: GadgetService
  ) { }

  public async getDefaultContract() {
    return await this.gadget.getContract(this.contactName);
  }
  public async getTAContract() {
    return await this.gadget.getContract(this.TAcontactName);
  }
}
