import { Injectable } from "@angular/core";
import { AccessPoint } from "src/app/dsutil-ng/access_point";
import { Connection } from "src/app/dsutil-ng/connection";
import { BasicSecurityToken, PublicSecurityToken } from "src/app/dsutil-ng/envelope";

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

  public async accessPointSend(opt: AccessPointSendOpt) {
    const application = await AccessPoint.resolve(opt.dsns, opt.contractName);
    let conn: any;
    if (opt.securityTokenType === 'Public') {
      conn = new Connection(application, new PublicSecurityToken());
    } else if (opt.securityTokenType === 'Basic') {
      conn = new Connection(application, new BasicSecurityToken(opt.BasicValue));
    }
    await conn.connect();
    const rsp = await conn.send(opt.serviceName, opt.body);
    const data = xml2json.parser(rsp.toXml())[opt.rootNote] || {};
    return data;
  }
}

export interface AccessPointSendOpt {
  dsns: string;
  contractName: string;
  securityTokenType: 'Public' | 'Basic';
  BasicValue?: any;
  serviceName: string;
  body: string;
  rootNote: string;
}