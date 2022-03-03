import { SimpleBootFront } from 'simple-boot-front/SimpleBootFront';
import { SimFrontOption, UrlType } from 'simple-boot-front/option/SimFrontOption';
import { AppRouter } from './app.router';
import {ConstructorType} from 'simple-boot-core/types/Types';
import { SimpleBootHttpSSRFactory } from 'simple-boot-http-ssr/SimpleBootHttpSSRFactory';
export const MakeSimFrontOption = (window: any) : SimFrontOption => {
    return new SimFrontOption(window).setUrlType(UrlType.path);
}

class Factory extends SimpleBootHttpSSRFactory {
    async factory(simFrontOption: SimFrontOption, using: ConstructorType<any>[] = [], domExcludes: ConstructorType<any>[] = []): Promise<SimpleBootFront> {
        const simpleBootFront = new SimpleBootFront(AppRouter, simFrontOption);
        simpleBootFront.domRendoerExcludeProxy.push(...domExcludes);
        return simpleBootFront;
    }
}
export default new Factory();
