import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from '../material.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NoticeMainComponent } from './notice-main/notice-main.component';
import { NoticeSummaryComponent } from './notice-summary/notice-summary.component';
import { NoticePushComponent } from './notice-push/notice-push.component';
import { NavigationItemDirective } from './header/navigation-item.directive';
import { ChooserComponent } from './chooser/chooser.component';
import { SelectedDetailComponent } from './chooser/seleted-detail/selected-detail.component';
import { RedactorComponent } from './redactor/redactor.component';
import { RedactorValueAccessorDirective } from './redactor/value-accessor.directive';
import { ReceiverListComponent } from './notice-push/receiver-list/receiver-list.component';
import { NoticeDetailComponent } from './notice-summary/notice-detail/notice-detail.component';
import { ByKeywordComponent } from './chooser/by-keyword/by-keyword.component';
import { ByTagComponent } from './chooser/by-tag/by-tag.component';
import { ByClassComponent } from './chooser/by-class/by-class.component';
import { RouteReuseStrategy } from '@angular/router';
import { AppRoutingCache } from './app-routing-cache';
import { ByRoleComponent } from './chooser/by-role/by-role.component';
import { SafePipe } from './safe.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NoticeMainComponent,
    HeaderComponent,
    FooterComponent,
    NoticeSummaryComponent,
    NoticePushComponent,
    NavigationItemDirective,
    ChooserComponent,
    SelectedDetailComponent,
    RedactorComponent,
    RedactorValueAccessorDirective,
    ReceiverListComponent,
    NoticeDetailComponent,
    ByKeywordComponent,
    ByTagComponent,
    ByClassComponent,
    ByRoleComponent,
    SafePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: AppRoutingCache }],
  bootstrap: [AppComponent],
  entryComponents: [
    ChooserComponent,
    SelectedDetailComponent,
    NoticeDetailComponent,
    ByKeywordComponent,
    ByTagComponent,
    ByClassComponent,
    ByRoleComponent,
  ]
})
export class AppModule { }
