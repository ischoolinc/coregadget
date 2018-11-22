import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class GadgetService {

  constructor(private zone: NgZone) { }

  /**
   * 取得 Contract 連接。
   * @param contractName 名稱。
   */
  public async getContract(contractName: string): Promise<Contract> {

    var vars = {};
    var hashes = window.location.hash.replace(/\#/, "").split('&');
    var searchs = window.location.search.replace(/\?/, "").split('&');
    for (var i = 0; i < hashes.length; i++) {
        var hash = decodeURIComponent(hashes[i]);
        var key = hash.substring(0, hash.indexOf("="));
        vars[key] = hash.substring(hash.indexOf("=") + 1);
    }
    for (var i = 0; i < searchs.length; i++) {
        var search = decodeURIComponent(searchs[i]);
        var key = search.substring(0, search.indexOf("="));
        vars[key] = search.substring(search.indexOf("=") + 1);
    }

    var dsns = vars["dsns"] || "test.p.kcbs.hc.edu.tw";

    var connection = dsutil.creatConnection(dsns + "/" + contractName, {});
    // connection.OnLoginError(function (err) {
    //     alert("Login Failed：\n" + err.XMLHttpRequest.responseText);
    // });
    return new Promise<any>((r, j) => {
      connection.ready(() => {
        r(new Contract(connection, this.zone));
      });

      connection.OnLoginError((err) => {
        j(err);
      });
    });


    // const contract = gadget.getContract(contractName);

    // return new Promise<any>((r, j) => {
    //   contract.ready(() => {
    //     r(new Contract(contract, this.zone));
    //   });

    //   contract.loginFailed((err) => {
    //     j(err);
    //   });
    // });
  }
}

/**
 * 代表已連接的 Contract。
 */
export class Contract {

  constructor(private contract: any, private zone: NgZone) { }

  /**
   * 呼叫 dsa service。
   */
  public send(serviceName: string, body: any = {}): Promise<any> {
    return new Promise<any>((r,j) => {
      this.contract.send({
        service: serviceName,
        body: body,
        result: (rsp, err, xmlhttp) => {
          if(err) {
            j(err);
          } else {
            r(rsp);
          }
        }
      });
    });
  }

  /**
   * 取得使用者資訊。
   */
  public get getUserInfo(): any {
    return this.contract.getUserInfo();
  }

  /**
   * 取得連接主機。
   */
  public get getAccessPoint(): any {
    return this.contract.getAccessPoint();
  }
}