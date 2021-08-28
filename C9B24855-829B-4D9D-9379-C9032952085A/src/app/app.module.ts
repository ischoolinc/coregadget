import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { GadgetService } from './gadget.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScoreSectionComponent } from './score-section/score-section.component';
import { BehaviorSectionComponent } from './behavior-section/behavior-section.component';
import {MatDialogModule} from '@angular/material/dialog';
import { BehaviorModalComponent } from './behavior-modal/behavior-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SelectModule } from './select/select.module';
import { Routes, RouterModule } from '@angular/router';
import { Router, Scroll } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';
import {MatTooltipModule} from '@angular/material/tooltip';
const routes: Routes = [

];
@NgModule({
  declarations: [
    AppComponent,
    ScoreSectionComponent,
     BehaviorSectionComponent,
     BehaviorModalComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    BrowserAnimationsModule,
    SelectModule,
    MatTooltipModule,
    RouterModule.forRoot(routes, { useHash: true })





  ],
  providers: [GadgetService],

  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(router: Router, viewportScroller: ViewportScroller) {
    viewportScroller.setOffset([0, 60]);
    router.events.pipe(filter(e => e instanceof Scroll)).subscribe((e: Scroll|any) => {
      if (e.anchor) {
        // anchor navigation
        setTimeout(() => {
          viewportScroller.scrollToAnchor(e.anchor);
        })
      } else if (e.position) {
        // backward navigation
        viewportScroller.scrollToPosition(e.position);
      } else {
        // forward navigation
        viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }

}
