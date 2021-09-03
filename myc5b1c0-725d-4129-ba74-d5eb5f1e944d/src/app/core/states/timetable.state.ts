import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken, Store } from '@ngxs/store';
import { from } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { CourseTimetable } from '../data/timetable';
import { TimetableService } from '../timetable.service';
import { ContextState } from './context.state';
import { Timetable } from './timetable.actions';

export interface TimetableStateModel extends Array<CourseTimetable> {
}

const TIMETABLE_STATE_TOKEN = new StateToken<TimetableStateModel>('Timetable');

@State<TimetableStateModel>({
  name: TIMETABLE_STATE_TOKEN,
  defaults: []
})
@Injectable()
export class TimetableState {

  #dsns!: string;

  constructor(
    private store: Store,
    private timetable: TimetableService
  ) {
    store.select(ContextState.dsns).subscribe(v => this.#dsns = v);
  }

  /** 從 Server 讀取全部資料。 */
  @Action(Timetable.FetchAll)
  async fetchAll({ setState }: StateContext<TimetableStateModel>) {
    const { timetable } = this;
    const tt = await timetable.getTimetable(this.#dsns);
    setState(tt);
  }

  /** 從 Server 讀取指定課程資料。 */
  @Action(Timetable.FetchCourse)
  async fetchCourse(ctx: StateContext<TimetableStateModel>, action: Timetable.FetchCourse) {
    const { timetable } = this;
    const state = ctx.getState();
    const tt = await timetable.getTimetable(this.#dsns, action.payload);

    const found = state.find(v => (+v.course_id) == (+action.payload));

    if(!found) {
      ctx.setState([...state, ...tt])
    } else {
      const newState = state.filter(v => v.course_id != action.payload);
      ctx.setState([...newState, ...tt]);
    }
  }

  /** 設定課程資料。 */
  @Action(Timetable.SetCourse)
  setCourse(ctx: StateContext<TimetableStateModel>, action: Timetable.SetCourse) {
    const { store, timetable } = this;

    return from(timetable.setTimetable(this.#dsns, action.payload)).pipe(
      concatMap(() => store.dispatch(new Timetable.FetchCourse(action.payload.course_id)))
    )
  }

  @Selector()
  static getCourse(state: TimetableStateModel) {
    return (courseId: string | number) => {
      return state.find(v => v.course_id == courseId);
    }
  }
}
