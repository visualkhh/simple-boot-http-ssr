import {SimpleBootHttpSSRFactory} from './SimpleBootHttpSSRFactory';
import {ConstructorType} from 'simple-boot-core/types/Types';
import { SimpleBootHttpServer } from 'simple-boot-http-server/SimpleBootHttpServer';
import { HttpServerOption } from 'simple-boot-http-server/option/HttpServerOption';
import { SimFrontOption } from 'simple-boot-front/option/SimFrontOption';

export class SimpleBootHttpSSRServer extends SimpleBootHttpServer {
    constructor(rootRouter: ConstructorType<Object>, public simFrontOption: SimFrontOption, option?: HttpServerOption) {
        super(rootRouter, option)
    }

    run(otherInstanceSim?: Map<ConstructorType<any>, any>): Promise<void> {
        const oi = new Map<ConstructorType<any>, any>()
        otherInstanceSim?.forEach((value, key) => oi.set(key, value));
        oi.set(SimFrontOption, this.simFrontOption);
        return super.run(oi);
    }
}
