import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { tap, withLatestFrom } from 'rxjs/operators';
import { MyInfo, SelectedContext } from '../data/login';
import { LoginService } from '../login.service';
import { Context } from './context.actions';

export interface ContextStateModel {
  /** OAuth AccessToken */
  accessToken: string;

  /** 目前選擇的學校、角色。 */
  context: SelectedContext;

  /** 個人資訊 */
  personal: MyInfo

}

const CONTEXT_STATE_TOKEN = new StateToken<ContextStateModel>('Context');

@State<ContextStateModel>({
  name: CONTEXT_STATE_TOKEN,
})
@Injectable()
export class ContextState {

  constructor(
    private login: LoginService
  ) { }

  @Action(Context.FetchAll)
  fetechAll(ctx: StateContext<ContextStateModel>) {
    const { login } = this;

    return login.getAccessToken().pipe(
      withLatestFrom(login.getSelectedContext()),
      withLatestFrom(login.getMyInfo()),
      tap({
        next: ([[token, selctx], info]) => {
          ctx.setState({
            accessToken: token,
            context: selctx,
            personal: info,
          });
        }
      })
    )
  }

  /** 取得快取的 AccessToken。 */
  @Selector()
  static accessToken({ accessToken }: ContextStateModel) {
    return accessToken
  }

  /** 取得當前使用者帳號。 */
  @Selector()
  static account({ personal: { account } }: ContextStateModel) {
    return account;
  }

  /** 取得當前 DSNS */
  @Selector()
  static dsns({ context: { dsns } }: ContextStateModel) {
    return dsns;
  }

  @Selector()
  static personalInfo({ personal }: ContextStateModel) {
    return personal;
  }
}