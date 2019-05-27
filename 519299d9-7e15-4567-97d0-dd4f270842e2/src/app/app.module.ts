import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoticeMainComponent } from './notice-main/notice-main.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoticeSummaryComponent } from './notice-summary/notice-summary.component';
import { NoticePushComponent } from './notice-push/notice-push.component';
import { NavigationItemDirective } from './header/navigation-item.directive';
import { MaterialModule } from './material.module';
import { ChooserComponent } from './chooser/chooser.component';
import { FormsModule } from '@angular/forms';
import { SelectedDetailComponent } from './chooser/seleted-detail/selected-detail.component';
import { RedactorComponent } from './redactor/redactor.component';
import { RedactorValueAccessorDirective } from './redactor/value-accessor.directive';
import { ReceiverListComponent } from './notice-push/receiver-list/receiver-list.component';
import { ValueAccessorDirective } from './notice-push/receiver-list/value-accessor.directive';
import { NoticeDetailComponent } from './notice-summary/notice-detail/notice-detail.component';

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
    ValueAccessorDirective,
    NoticeDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    ChooserComponent,
    SelectedDetailComponent,
    NoticeDetailComponent
  ]
})
export class AppModule { }
