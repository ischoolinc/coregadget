import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class AppRoutingCache extends RouteReuseStrategy {

  public static handlers: { [key: string]: DetachedRouteHandle } = {};

  // 確定是否應重用路由
  public shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    current: ActivatedRouteSnapshot
  ): boolean {
    // 可以取得轉跳前後的路徑
    // console.log('CustomReuseStrategy:shouldReuseRoute', current.routeConfig, future.routeConfig);
    return future.routeConfig === current.routeConfig;
  }

  // 確定是否應該分離此路由（及其子樹）以便以後重用
  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // 默認所有的路由設定都可以重複使用
    // 可在 app-routing 中使用 route.data 的方式來設定重複使用的規則
    // console.log('CustomReuseStrategy:shouldDetach', route);
    return route.data.shouldReuse || false;
  }

  // 當路由進入時，可判斷是否還原路由的暫存內容
  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // console.log('CustomReuseStrategy:shouldAttach', route);
    return (
      !!route.routeConfig && !!AppRoutingCache.handlers[route.routeConfig.path]
    );
  }

  // 當路由離開時，會觸發此方法
  public store(
    route: ActivatedRouteSnapshot,
    handle: DetachedRouteHandle
  ): void {
    // 將目前路由內容暫存起來
    // console.log('CustomReuseStrategy:store', route, handle);
    AppRoutingCache.handlers[route.routeConfig.path] = handle;
  }

  // 從 Cache 中取得對應的暫存內容
  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    // console.log('CustomReuseStrategy:retrieve', route);
    if (!route.routeConfig) {
      return null;
    }
    return AppRoutingCache.handlers[route.routeConfig.path];
  }

  public resetCache() {
    delete AppRoutingCache.handlers[''];
  }
}
