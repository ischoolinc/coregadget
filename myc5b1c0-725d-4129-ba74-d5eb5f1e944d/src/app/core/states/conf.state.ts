import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken, Store } from '@ngxs/store';
import { ConfService } from '../conf.service';
import { ServiceConf } from '../data/service-conf';
import { Conf } from './conf.actions';
import { ContextState } from './context.state';

export interface ServiceConfStateModel extends Array<ServiceConf> {
}

const CONF_STATE_TOKEN = new StateToken<ServiceConfStateModel>('CourseConf');

@State<ServiceConfStateModel>({
  name: CONF_STATE_TOKEN,
  defaults: []
})
@Injectable()
export class ServiceConfState {

  #dsns!: string;

  constructor(
    private store: Store,
    private conf: ConfService
  ) {
    store.select(ContextState.dsns).subscribe(v => this.#dsns = v);
  }

  /** 從 Server 讀取全部資料。 */
  @Action(Conf.FetchAll)
  async fetchAll({ setState }: StateContext<ServiceConfStateModel>) {
    const { conf } = this;
    const allConf = await conf.getConf(this.#dsns);
    setState(allConf);
  }

  /** 從 Server 讀取指定課程資料。 */
  @Action(Conf.FetchConf)
  async fetchCourse(ctx: StateContext<ServiceConfStateModel>, action: Conf.FetchConf) {
    const { conf } = this;
    const state = ctx.getState();
    const tt = await conf.getConf(this.#dsns, {
      course_id: action.payload?.course_id,
    });

    const found = state.find(v => (+v.course_id) == (+action.payload.course_id));

    if(!found) {
      ctx.setState([...state, ...tt])
    } else {
      // 去掉原來在陣列中的元素。
      const newState = state.filter(v => v.course_id != action.payload.course_id);
      ctx.setState([...newState, ...tt]);
    }
  }

}