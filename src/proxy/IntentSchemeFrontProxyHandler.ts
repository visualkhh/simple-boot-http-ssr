import { getSim } from 'simple-boot-core/decorators/SimDecorator';
import { HttpHeaders } from 'simple-boot-http-server/codes/HttpHeaders';
import { IntentSchemeFilterHttpHeaders, IntentSchemeFilterMimes } from '../filters/IntentSchemeFilter';

export class IntentSchemeFrontProxyHandler implements ProxyHandler<any> {


  public get(target: any, prop: string): any {
    const t = target[prop];
    if (typeof t === 'function') {
      return (...args: any[]) => {
        const simstanceManager = target._SimpleBoot_simstanceManager;
        const simOption = target._SimpleBoot_simOption;
        const config = getSim(target);
        // const scheme = getSim(target)?.scheme;
        if (simstanceManager && simOption && config?.scheme) {
          const key = config.scheme + '_' + prop;
          const isHas = (key in (simOption.window.server_side_data ?? {}));
          if (isHas) {
            const data = simOption.window.server_side_data?.[key];
            delete simOption.window.server_side_data?.[key];
            let rdata;
            if (data instanceof Promise) {
              rdata = Promise.resolve(data);
            } else {
              rdata = data;
            }
            return rdata;
          }
        } else {
         return fetch(`/${prop.toString()}`,
            {
              method: 'POST',
              headers: {[HttpHeaders.ContentType]: IntentSchemeFilterMimes.ApplicationJson, [IntentSchemeFilterHttpHeaders.XSimpleBootSsrIntentScheme]: config?.scheme ?? ''},
              body: JSON.stringify(args[0])
            }
          ).then(async (res) => {
           try {
             const data = await res.json();
           } catch(e) {
             return undefined;
           }
          });
        }
        // return t.apply(target, args);
      }
    } else {
      return t;
    }
  }


  // apply(target: Function, thisArg: any, ...argumentsList: any[]): any {
  //   console.log('-IntentSchemeFrontProxyHandler----?????')
  //   return target(...argumentsList);
  // }

}
