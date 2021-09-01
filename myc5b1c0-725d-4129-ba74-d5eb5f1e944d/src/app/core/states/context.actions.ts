
/** 系統當前的狀態資訊，例如登入的 dsns、角色、個人資訊… */
export namespace Context {

  /** 立即取得目前使用者選擇的「學校、角色…」等資料。 */
  export class FetchAll {
    static readonly type = '[Context] FetchAll';
  }
}
