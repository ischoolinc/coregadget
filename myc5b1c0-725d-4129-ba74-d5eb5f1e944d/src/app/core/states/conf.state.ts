import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken, Store } from '@ngxs/store';
import { ConfService } from '../conf.service';
import { ServiceConf } from '../data/service-conf';
import { Conf } from './conf.actions';
import { ContextState, ContextStateModel } from './context.state';

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
  #role!: string;

  constructor(
    private store: Store,
    private conf: ConfService
  ) {
    store.select<ContextStateModel>(ContextState).subscribe(v => {
      // console.log(v);
      this.#dsns = v?.context?.dsns;
      this.#role = v?.context?.role;
    });
  }

  /** 從 Server 讀取全部資料。 */
  @Action(Conf.FetchAll)
  async fetchAll({ setState }: StateContext<ServiceConfStateModel>) {
    const { conf } = this;
    const allConf = await conf.getConf(this.#dsns, this.#role);
    setState(allConf);
  }

  /** 從 Server 讀取指定課程資料。 */
  @Action(Conf.FetchConf)
  async fetchServices(ctx: StateContext<ServiceConfStateModel>, action: Conf.FetchConf) {
    const { conf } = this;
    const state = ctx.getState();
    const tt = await conf.getConf(this.#dsns, this.#role, {
      course_id: action.payload?.course_id,
    });

    const found = state.find(v => (+v.course_id) == (+action.payload.course_id));

    if (!found) {
      ctx.setState([...state, ...tt])
    } else {
      // 去掉原來在陣列中的元素。
      const newState = state.filter(v => v.course_id != action.payload.course_id);
      ctx.setState([...newState, ...tt]);
    }
  }

  /** 寫入 service conf。 */
  @Action(Conf.SetConf)
  async setConf(ctx: StateContext<ServiceConfStateModel>, action: Conf.SetConf) {
    const { conf } = this;
    const { payload } = action;
    const state = ctx.getState();
    const tt = await conf.setConf(this.#dsns, payload);
    const compose = { ...tt, course_id: payload.course_id, service_id: payload.service_id };

    const found = state.find(v => {
      return (+v.course_id == +payload.course_id!)
        && v.service_id == payload.service_id;
    });

    if (!found) {
      const tmp = [...state, compose].sort((a, b) => a.order - b.order);
      return ctx.setState(tmp);
    } else {
      // 去掉原來在陣列中的元素。
      const newState = state.filter(v => {
        return !!!((+v.course_id == +payload.course_id!)
          && v.service_id == payload.service_id);
      });

      const tmp = [...newState, compose].sort((a, b) => a.order - b.order);
      return ctx.setState(tmp);
    }
  }

  @Selector()
  static getServicesConf(state: ServiceConfStateModel) {
    return (courseId: string | number) => {
      return state.filter(v => {
        if (v.course_id == courseId) {
          return true;
        } else {
          return false;
        }
      });
    }
  }

  @Selector()
  static getServiceConf(state: ServiceConfStateModel) {
    return (courseId: string | number, serviceId: 'google_classroom' | '1campus_oha' | 'customize') => {
      return state.find(v => {
        if (v.course_id == courseId && v.service_id == serviceId) {
          return true;
        } else {
          return false;
        }
      });
    }
  }
}
