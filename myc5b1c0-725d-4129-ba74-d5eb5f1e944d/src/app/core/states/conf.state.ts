import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken, Store } from '@ngxs/store';
import { ConfService } from '../conf.service';
import { CourseConf } from '../data/conf';
import { Conf } from './conf.actions';
import { ContextState } from './context.state';

export interface CourseConfStateModel extends Array<CourseConf> {
}

const CONF_STATE_TOKEN = new StateToken<CourseConfStateModel>('CourseConf');

@State<CourseConfStateModel>({
  name: CONF_STATE_TOKEN,
  defaults: []
})
@Injectable()
export class CourseConfState {

  #dsns!: string;

  constructor(
    private store: Store,
    private conf: ConfService
  ) {
    store.select(ContextState.dsns).subscribe(v => this.#dsns = v);
  }

  /** 從 Server 讀取全部資料。 */
  @Action(Conf.FetchAll)
  async fetchAll({ setState }: StateContext<CourseConfStateModel>) {
    const { conf } = this;
    const allConf = await conf.getConf(this.#dsns);
    setState(allConf);
  }

}