import { SimpleBootFront } from 'simple-boot-front/SimpleBootFront';
import { SimFrontOption, UrlType } from 'simple-boot-front/option/SimFrontOption';
import { AppRouter } from './app.router';
import {ConstructorType} from 'simple-boot-core/types/Types';
import { SimpleBootHttpSSRFactory } from 'simple-boot-http-ssr/SimpleBootHttpSSRFactory';
export const MakeSimFrontOption = (window: any) : SimFrontOption => {
    return new SimFrontOption(window).setUrlType(UrlType.path);
}

class Factory extends SimpleBootHttpSSRFactory {
    factory(simFrontOption: SimFrontOption, using: ConstructorType<any>[] = [], domExcludes: ConstructorType<any>[] = []): Promise<SimpleBootFront> {
        // console.log('create simplefront--->', (simFrontOption.window as any).uuid, simFrontOption.window.location.href);
        // const simFrontOption = new SimFrontOption(window).setUrlType(UrlType.path);
        const simpleBootFront = new SimpleBootFront(AppRouter, simFrontOption);
        // const simpleBootFront = new SimpleBootFront(TestRouterComponent, simFrontOption);
        simpleBootFront.domRendoerExcludeProxy.push(...domExcludes);
        return Promise.resolve(simpleBootFront);
    }
}
export default new Factory();
