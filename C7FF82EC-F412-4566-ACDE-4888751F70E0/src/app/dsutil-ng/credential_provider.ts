import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";

export const DSA_ACCESSTOKEN = new InjectionToken<string>('provide oauth access_token.');

export interface AccessTokenCredential {
    getCredential() : Observable<string>
}