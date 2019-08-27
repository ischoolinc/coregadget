import { Injectable, NgZone } from "@angular/core";
import { Observable } from 'rxjs';

/**
 * 實驗性作法。
 */
export class Contract {
  constructor(private contract: any, private zone: NgZone) { }

  public send<T>(serviceName: string, body: any = {}) {

    return (Observable.create(observer => {
      this.contract.send({
        service: serviceName,
        body,
        result: (rsp, err, xmlhttp) => {
          this.zone.run(() => { // 如果沒在 run 在 ngzone，畫面不會更新。
            if (err) {
              observer.error(err);
            } else {
              observer.next(rsp);
              observer.complete();
            }
          });
        }
      });
    }) as Observable<T>);
  }

  public get userInfo(): UserInfo {
    const userInfo = this.contract.getUserInfo() as ContractUserInfo;
    const { UserName } = userInfo;
    const uuid = userInfo.Property.find(v => {
      return v.Name === 'UserUUID';
    });

    return { userName: UserName, uuid: uuid["@text"] };
  }

}

@Injectable({
  providedIn: "root"
})
export class DSAService {

  constructor(
    private zone: NgZone
  ) { }

  public getContract(
    contractName: string = "1campus.mobile.v2.guest"
  ) {

    return Observable.create(observer => {
      console.log(`connect...${contractName}`);

      const contract = gadget.getContract(contractName);
      contract.ready(() => {

        this.zone.run(() => {
          observer.next(new Contract(contract, this.zone));
          observer.complete();
        });
      });

      contract.loginFailed(err => {
        this.zone.run(() => { observer.error(err); });
      });
    }) as Observable<Contract>;
  }

}

export interface UserInfo {
  userName: string;
  uuid: string;
}

interface ContractUserInfo {
  '@': string[];
  Application: string;
  Contract: string;
  Expired: string;
  Extendable: string;
  Server: string;
  Timeout: string;
  UserName: string;
  Property: Property[];
}

interface Property {
  '@text'?: string;
  '@': string[];
  Name: string;
}
