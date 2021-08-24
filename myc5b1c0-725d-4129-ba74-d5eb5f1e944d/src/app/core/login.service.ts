import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { MyInfo, SelectedContext } from './data/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private config: ConfigService,
  ) { }

  public getAccessToken(): Observable<string> {
    const { http } = this;
    return http.get<any>('/auth/getAccessToken').pipe(
      map(v => v.access_token)
    );
  }

  public getMyInfo() {
    const { http } = this;
    return http.get<MyInfo>('/auth/getMyInfo');
  }

  public getSelectedContext() {
    const { http } = this;
    return http.get<SelectedContext>(`${this.config.API_BASE}/gadget/selected_context`);
  }

  /** 取得穩定登入 auth 的第三方連結。 */
  public getLinkout(target: string) {
    // 確保 access token 在最新狀態。
    return `/auth/linkout?redirect_url=${encodeURIComponent(target)}`;
  }
}
