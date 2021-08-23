import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccessTokenCredential } from './dsutil-ng/credential_provider';

@Injectable({
  providedIn: 'root'
})
export class RootAccessTokenService implements AccessTokenCredential {

  constructor(
    private http: HttpClient
  ) { }

  getCredential(): Observable<string> {
    return this.http.get<any>('/auth/getAccessToken').pipe(
      map(v => {
        return v.access_token;
      })
    )
  }
}
