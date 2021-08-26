import { Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken } from '@ngxs/store';
import { Course } from '../data/timetable';
import { Timetable } from './timetable.actions';

export interface TimetableStateModel extends Array<Course> {
}

const TIMETABLE_STATE_TOKEN = new StateToken<TimetableStateModel>('Timetable');

@State<TimetableStateModel>({
    name: TIMETABLE_STATE_TOKEN,
    defaults: []
  })
  @Injectable()
  export class TimetableState {
    @Action(Timetable.FetchAll)
    feedAnimals(ctx: StateContext<TimetableStateModel>) {
      const state = ctx.getState();
      ctx.setState({
        ...state,
      });
    }
  }