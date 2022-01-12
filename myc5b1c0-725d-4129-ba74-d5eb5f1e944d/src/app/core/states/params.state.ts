import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken, Store } from '@ngxs/store';
import { from } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { GadgetParams, ServerService } from '../server.service';
import { Params } from './params.actions';

export interface ParamsStateModel extends GadgetParams {
}

const PARAMS_STATE_TOKEN = new StateToken<ParamsStateModel>('Params');

@State<ParamsStateModel>({
  name: PARAMS_STATE_TOKEN,
  defaults: {
    schedule_source: 'personal',
  }
})
@Injectable()
export class ParamsState {

  constructor(
    private server: ServerService
  ) {  }

  /** 從 Server 讀取全部資料。 */
  @Action(Params.FetchAll)
  async fetchAll({ setState }: StateContext<ParamsStateModel>) {
    const { server } = this;
    const tt = await server.params();
    setState(tt);
  }

}
