import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
    return http.get('/auth/getMyInfo');
  }
}
