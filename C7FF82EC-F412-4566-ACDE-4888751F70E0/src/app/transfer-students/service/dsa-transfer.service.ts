import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class DsaTransferService {
  private connection: Map<string, any> = new Map();

  private async getContract(contractName: string): Promise<any> {
    if (!this.connection.has(contractName)) {
      const contract = gadget.getContract(contractName);
      this.connection.set(contractName, await new Promise<any>((r, j) => {
        contract.ready(() => {
          r(contract);
        });
        contract.loginFailed(err => {
          j(err);
        });
      }));
    }
    return this.connection.get(contractName);
  }

  public async send(serviceName: string, body: any = {}, contractName = '1campus.counsel.teacher'): Promise<any> {
    let conn = await this.getContract(contractName);
    return new Promise<any>((r, j) => {
      conn.send({
        service: serviceName,
        body: body,
        result: (rsp, err, xmlhttp) => {
          if (err) {
            j(err);
          } else {
            r(rsp);
          }
        }
      });
    });
  }
}
