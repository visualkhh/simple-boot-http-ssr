import {SimpleBootHttpSSRFactory} from './SimpleBootHttpSSRFactory';
import {ConstructorType} from 'simple-boot-core/types/Types';
import { SimpleBootHttpServer } from 'simple-boot-http-server/SimpleBootHttpServer';
import { HttpServerOption } from 'simple-boot-http-server/option/HttpServerOption';
import { SimFrontOption } from 'simple-boot-front/option/SimFrontOption';

export class SimpleBootHttpSSRServer extends SimpleBootHttpServer {
    constructor(rootRouter: ConstructorType<Object>, option?: HttpServerOption) {
        super(rootRouter, option)
    }

    run(otherInstanceSim: Map<ConstructorType<any>, any> = new Map<ConstructorType<any>, any>()): Promise<void> {
        const simFrontOption = new SimFrontOption({} as any)
        otherInstanceSim.set(SimFrontOption, simFrontOption)
        return super.run(otherInstanceSim);
    }
}
