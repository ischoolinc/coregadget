import { Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken, Store } from '@ngxs/store';
import { Course } from '../data/timetable';
import { TimetableService } from '../timetable.service';
import { ContextState } from './context.state';
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

  constructor(
    private store: Store,
    private timetable: TimetableService
  ) { }

  @Action(Timetable.FetchAll)
  async fetchAll({ setState }: StateContext<TimetableStateModel>) {
    const { store, timetable } = this;

    const dsns = store.selectSnapshot(ContextState.dsns);
    if (!dsns) { throw new Error('dsns 未準備好。') }

    const tt = await timetable.getTimetable(dsns);
    setState(tt);
  }

  @Action(Timetable.SetPeriods)
  setPeriods(ctx: StateContext<TimetableStateModel>) {
    const { store, timetable } = this;
    const state = ctx.getState();

    
    
  }
}