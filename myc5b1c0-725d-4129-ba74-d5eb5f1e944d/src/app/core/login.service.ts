import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MyInfo, SelectedContext } from './data/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
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
    return http.get<SelectedContext>('/service/gadget/selected_context');
  }
}
