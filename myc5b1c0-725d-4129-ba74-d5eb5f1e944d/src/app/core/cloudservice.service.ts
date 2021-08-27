import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';
import { GadgetCustomCloudServiceRec } from './data/cloudservice';

@Injectable({
  providedIn: 'root'
})
export class CloudServiceService {

  constructor(
    private http: HttpClient,
    private login: LoginService,
  ) {}


  /**老師以學年期取得自訂課程、班級雲端服務清單 */
  public async getWeb3CloudServiceBySemester(appName: string, opt: { currentSemester?: boolean, schoolYear?: string, semester?: string }) {
    const accessToken = await this.login.getAccessToken().toPromise();

    const content = `
      <Request>
        <CurrentSemester>${opt.currentSemester ? 'true' : 'false'}</CurrentSemester>
        <SchoolYear>${opt.schoolYear || ''}</SchoolYear>
        <Semester>${opt.semester || ''}</Semester>
      </Request>
    `;

    const path = [
      `https://dsns.ischool.com.tw/${appName}/web3.v1.teacher/_.getWeb3CloudService`,
      `?stt=PassportAccessToken`,
      `&AccessToken=${accessToken}`,
      `&rsptype=json`,
      `&content=${encodeURIComponent(content)}`
    ].join('');
    const rsp: any = await this.http.get(path).toPromise();
    return [].concat((rsp && rsp.CloudService) || []).map((v: any) => {
      v.Enabled = (v.Enabled === 't' ? true : false);
      return v;
    });
  }

  /**老師取得自訂課程、班級雲端服務清單 */
  public async getWeb3CloudServiceByTargetId(appName: string, classIds: number[], courseIds: number[]) {
    const accessToken = await this.login.getAccessToken().toPromise();

    const xmlCourseIds = courseIds.map(v => `<CourseId>${v}</CourseId>`);
    const xmlClassIds = classIds.map(v => `<ClassId>${v}</ClassId>`);

    const path = [
      `https://dsns.ischool.com.tw/${appName}/web3.v1.teacher/_.getWeb3CloudService`,
      `?stt=PassportAccessToken`,
      `&AccessToken=${accessToken}`,
      `&rsptype=json`,
      `&content=${encodeURIComponent(`<Request>${xmlCourseIds.join('')}${xmlClassIds.join('')}</Request>`)}`
    ].join('');
    const rsp: any = await this.http.get(path).toPromise();
    return [].concat((rsp && rsp.CloudService) || []).map((v: any) => {
      v.Enabled = (v.Enabled === 't' ? true : false);
      return v;
    });
  }

  /**新增Web3 使用者自訂課程、班級雲端服務 */
  public async addWeb3CustomCloudService(appName: string, data: GadgetCustomCloudServiceRec) {
    const accessToken = await this.login.getAccessToken().toPromise();

    const content = `
      <Request>
        <TargetType>${data.TargetType || ''}</TargetType>
        <TargetId>${data.TargetId || ''}</TargetId>
        <Title>${data.ServiceId || ''}</Title>
        <Link>${data.Link || ''}</Link>
        <Enabled>true</Enabled>
      </Request>
    `;

    const path = [
      `https://dsns.ischool.com.tw/${appName}/web3.v1.teacher/_.addWeb3CustomCloudService`,
      `?stt=PassportAccessToken`,
      `&AccessToken=${accessToken}`,
      `&rsptype=json`,
      `&content=${encodeURIComponent(content)}`
    ].join('');
    const rsp: any = await this.http.get(path).toPromise();
    return [].concat((rsp && rsp.CloudService) || []);
  }

  /**修改Web3 使用者自訂課程、班級雲端服務 */
  public async updateWeb3CustomCloudService(appName: string, data: GadgetCustomCloudServiceRec) {
    const accessToken = await this.login.getAccessToken().toPromise();

    const content = `
      <Request>
        <UID></UID>
        <Title>${data.ServiceId || ''}</Title>
        <Link>${data.Link || ''}</Link>
      </Request>
    `;

    const path = [
      `https://dsns.ischool.com.tw/${appName}/web3.v1.teacher/_.updateWeb3CustomCloudService`,
      `?stt=PassportAccessToken`,
      `&AccessToken=${accessToken}`,
      `&rsptype=json`,
      `&content=${encodeURIComponent(content)}`
    ].join('');
    const rsp: any = await this.http.get(path).toPromise();
    return [].concat((rsp && rsp.CloudService) || []);
  }

  /**刪除Web3 使用者自訂課程、班級雲端服務 */
  public async delWeb3CustomCloudService(appName: string, uid: string) {
    const accessToken = await this.login.getAccessToken().toPromise();

    const path = [
      `https://dsns.ischool.com.tw/${appName}/web3.v1.teacher/_.delWeb3CustomCloudService`,
      `?stt=PassportAccessToken`,
      `&AccessToken=${accessToken}`,
      `&rsptype=json`,
      `&content=${encodeURIComponent(`<Request><Uid>${uid}</Uid></Request>`)}`
    ].join('');
    const rsp: any = await this.http.get(path).toPromise();
    return [].concat((rsp && rsp.CloudService) || []);
  }

  /**設定Web3 使用者自訂課程、班級雲端服務 */
  public async setWeb3CustomCloudServiceEnabled(appName: string, uid: string, enabled: boolean) {
    const accessToken = await this.login.getAccessToken().toPromise();

    const path = [
      `https://dsns.ischool.com.tw/${appName}/web3.v1.teacher/_.setWeb3CustomCloudServiceEnabled`,
      `?stt=PassportAccessToken`,
      `&AccessToken=${accessToken}`,
      `&rsptype=json`,
      `&content=${encodeURIComponent(`<Request><UID>${uid}</UID><Enabled>${enabled ? 'true' : 'false'}</Enabled></Request>`)}`
    ].join('');
    const rsp: any = await this.http.get(path).toPromise();
    return [].concat((rsp && rsp.CloudService) || []);
  }
}
