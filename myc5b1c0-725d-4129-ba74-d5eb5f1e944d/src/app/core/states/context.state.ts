import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { tap, withLatestFrom } from 'rxjs/operators';
import { LoginService } from '../login.service';
import { Context } from './context.actions';

export interface ContextStateModel {
  /** 登入帳號。 */
  account: string
  /** 在 Auth 上的姓名。 */
  name: string;
  /** OAuth AccessToken */
  accessToken: string;
  /** DSNS */
  dsns: string;
  /** 目前選擇的角色。 */
  role: string;
}

const CONTEXT_STATE_TOKEN = new StateToken<ContextStateModel>('Context');

@State<ContextStateModel>({
  name: CONTEXT_STATE_TOKEN,
  defaults: {
    account: '',
    name: '',
    accessToken: '',
    dsns: '',
    role: '',
  }
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
            name: info.name,
            account: info.account,
            dsns: selctx.dsns,
            role: selctx.role
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

  @Selector()
  static account({ account }: ContextStateModel) {
    return account;
  }
}