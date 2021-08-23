import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DSUtilNgModule } from './dsutil-ng/dsutil-ng.module';
import { DSA_ACCESSTOKEN } from './dsutil-ng/credential_provider';
import { RootAccessTokenService } from './root-access-token.service';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DSUtilNgModule,
  ],
  providers: [{
    provide: DSA_ACCESSTOKEN,
    useClass: RootAccessTokenService
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
