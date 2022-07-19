import {ConstructorType} from 'simple-boot-core/types/Types';
import { SimpleBootHttpServer } from 'simple-boot-http-server/SimpleBootHttpServer';
import { HttpServerOption } from 'simple-boot-http-server/option/HttpServerOption';

export class SimpleBootHttpSSRServer extends SimpleBootHttpServer {
    constructor(rootRouter: ConstructorType<Object>, option?: HttpServerOption) {
        super(rootRouter, option)
    }

    // @ts-ignore
    run(otherInstanceSim?: Map<ConstructorType<any>, any>) {
        const oi = new Map<ConstructorType<any>, any>()
        otherInstanceSim?.forEach((value, key) => oi.set(key, value));
        return super.run(oi);
    }
}
