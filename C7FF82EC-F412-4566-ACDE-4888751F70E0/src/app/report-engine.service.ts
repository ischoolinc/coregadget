import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * 傳送data給 raport-engine Server 產生報表
 *
 * @export
 */
@Injectable({
  providedIn: 'root'
})

export class ReportEngineService {

  ServerURL: string;
  constructor(private http: HttpClient) {

    // this.ServerURL = "http://localhost:5000";
     this.ServerURL = "https://report.ischool.com.tw:3005";
  }

  /**
   * 送出資料並產生報表
   *
   */
  async SendGroupAnysData(data: any): Promise<any> {
    return await this.http.post<any>(`${this.ServerURL}/poc/merge`, data)
      .toPromise()
      // .then(res => {
      //   console.log("res", res);
      //   return res;
      // }).catch((rsp) => {
      //   console.log("rsp",rsp);
      // }
      // )
      ;
  }

  async CompressFile(fileUID: any): Promise<any> {

    return await this.http.get<any>(`${this.ServerURL}/poc/compression?list=${fileUID}`).toPromise();
   }


  GetDownLoadURL(downID: string): string {
    return `${this.ServerURL}/poc/download?id=${downID}`;

  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    }
  }


}
