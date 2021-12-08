import {SimpleBootHttpSSRFactory} from './SimpleBootHttpSSRFactory';
import {JsdomInitializer} from './initializers/JsdomInitializer';
import {Initializer} from './initializers/Initializer';
import {SimpleBootFront} from 'simple-boot-front/SimpleBootFront';
import * as JSDOM from 'jsdom';

export abstract class SimpleBootHttpSSR {

    constructor(private frontDistPath: string, private simpleBootFrontFactory: {factory: SimpleBootHttpSSRFactory, params: any[]}, private initializer: Initializer<any>[] = []) {
    }

    async run() {
        const jsDom = await new JsdomInitializer(this.frontDistPath).run();
        const initializers = [];
        for (let initializerElement of this.initializer) {
            initializers.push(initializerElement.run());
        }
        const s = await this.simpleBootFrontFactory.factory.createFront(window, ...this.simpleBootFrontFactory.params);
        this.startUp(jsDom, s, initializers);
    }
    abstract startUp(jsDom: JSDOM.JSDOM, simpleBootFront: SimpleBootFront, initializerReturns: any[]): void;

}