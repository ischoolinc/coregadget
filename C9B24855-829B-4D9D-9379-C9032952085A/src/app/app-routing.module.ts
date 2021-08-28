import { BehaviorSectionComponent } from './behavior-section/behavior-section.component';
import { NgModule } from '@angular/core';
import { GadgetService } from './gadget.service';
import {ExtraOptions, Routes, RouterModule } from '@angular/router';
import { Injectable } from '@angular/core';
import { ScoreSectionComponent } from './score-section/score-section.component';

const routes: Routes = [
{path :"" ,component :ScoreSectionComponent},
{path :"esl_score/:course_id" ,component :ScoreSectionComponent},
{path :"behavior/:course_id" ,component :BehaviorSectionComponent}

];
const routerOptions :ExtraOptions
={
scrollPositionRestoration:'enabled',
anchorScrolling:'enabled'
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule { }
