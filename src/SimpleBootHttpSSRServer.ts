import { ConstructorType } from 'simple-boot-core/types/Types';
import { SimpleBootHttpServer } from 'simple-boot-http-server/SimpleBootHttpServer';
import { HttpServerOption } from 'simple-boot-http-server/option/HttpServerOption';
import { SimstanceManager } from 'simple-boot-core/simstance/SimstanceManager';

export class SimpleBootHttpSSRServer extends SimpleBootHttpServer {
  constructor(rootRouter: ConstructorType<Object>, option?: HttpServerOption) {
    super(rootRouter, option)
  }

  run(otherInstanceSim?: Map<ConstructorType<any>, any>): SimstanceManager {
    const oi = new Map<ConstructorType<any>, any>()
    otherInstanceSim?.forEach((value, key) => oi.set(key, value));
    return super.run(oi);
  }
}
