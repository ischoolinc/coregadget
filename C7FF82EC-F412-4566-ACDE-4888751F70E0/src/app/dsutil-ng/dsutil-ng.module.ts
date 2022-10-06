import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DSAHttpClient } from './dsa_http_client';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
})
export class DSUtilNgModule {
  constructor(private http: HttpClient) {
    DSAHttpClient.setHttpClient(http);
  }
}
