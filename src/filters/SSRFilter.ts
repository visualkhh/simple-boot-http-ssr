import { Navigation } from 'simple-boot-front/service/Navigation';
import {IncomingMessage, ServerResponse} from 'http';
import {RequestResponse} from 'simple-boot-http-server/models/RequestResponse';
import {SimpleBootFront} from 'simple-boot-front/SimpleBootFront';
import {HttpHeaders} from 'simple-boot-http-server/codes/HttpHeaders';
import { OnDoneRoute } from 'simple-boot-front/route/OnDoneRoute';
import { SimpleBootHttpSSRFactory } from '../SimpleBootHttpSSRFactory';
import fs from 'fs';
import path from 'path';
import JSDOM from 'jsdom';
import { ConstructorType } from 'simple-boot-core/types/Types';
import { RandomUtils } from 'simple-boot-core/utils/random/RandomUtils';
import {JsdomInitializer} from '../initializers/JsdomInitializer';
import {RouterModule} from 'simple-boot-core/route/RouterModule';
import { getSim, SimConfig } from 'simple-boot-core/decorators/SimDecorator';
import { Filter } from 'simple-boot-http-server/filters/Filter';
import { Mimes } from 'simple-boot-http-server/codes/Mimes';
import { HttpStatus } from 'simple-boot-http-server/codes/HttpStatus';
import { SimpleBootHttpServer } from 'simple-boot-http-server';
import { SimFrontOption } from 'simple-boot-front/option/SimFrontOption';
import { SimpleBootHttpSSRServer } from 'SimpleBootHttpSSRServer';

export type FactoryAndParams = {
    factory: SimpleBootHttpSSRFactory;
    using: ConstructorType<any>[];
    domExcludes: ConstructorType<any>[];
}
export class SSRFilter implements Filter, OnDoneRoute {
    // public oneRequestStorage: {[key: string]: any} = {};
    // constructor(private simpleBootFront: SimpleBootFront) {
    constructor(private frontDistPath: string, private factory: FactoryAndParams, public otherInstanceSim: Map<ConstructorType<any>, any>) {
    }

    // clearOneRequestStorage(key?: string) {
    //     if (key) {
    //         delete this.oneRequestStorage[key];
    //     } else {
    //         this.oneRequestStorage = {};
    //     }
    // }

    async before(req: IncomingMessage, res: ServerResponse, app: SimpleBootHttpServer) {
        // this.clearOneRequestStorage();

        const rr = new RequestResponse(req, res)
        // if ((rr.req.headers.accept ?? Mimes.TextHtml).indexOf(Mimes.TextHtml) >= 0) {
        if (rr.reqHasAcceptHeader(Mimes.TextHtml)) {
            const jsdom = new JsdomInitializer(this.frontDistPath, {url: `http://localhost${rr.reqUrl}`}).run();
            const window = jsdom.window as unknown as Window & typeof globalThis;
            (window as any).uuid = RandomUtils.getRandomString(10);
            // app.intentManager.simstanceManager.getOrNewSim(SimFrontOption)
            const ssrApp = app as SimpleBootHttpSSRServer;
            const simpleBootFront = await this.factory.factory.create(window as any, this.factory.using, this.factory.domExcludes);
            // app.simstanceManager.set(SimFrontOption, simpleBootFront.option);
            simpleBootFront.regDoneRouteCallBack(this);
            simpleBootFront.pushDoneRouteCallBack(this, {rr, window});
            simpleBootFront.run(this.otherInstanceSim);
            return false;
        } else {
            return true;
        }
    }

    async after(req: IncomingMessage, res: ServerResponse, app: SimpleBootHttpServer) {
        return true;
    }

    onDoneRoute(routerModule: RouterModule, param: {rr: RequestResponse, window: Window}): void {
        const aroundStorage = (window as any).aroundStorage;
        // console.log('ssrfilter uuid after -->');
        let html = param.window.document.documentElement.outerHTML;
        if (aroundStorage) {
            const data = Object.entries(aroundStorage).map(([k, v]) => {
                if (typeof v === 'string') {
                    return `window.localStorage.setItem('${k}', '${v}')`;
                } else {
                    return `window.localStorage.setItem('${k}', '${JSON.stringify(v)}')`;
                }
            }).join(';');
            if(data) {
                html = html.replace('</body>', `<script>${data}</script></body>`);
            }
        }
        const header = {} as any;
        header[HttpHeaders.ContentType] = Mimes.TextHtml;
        param.rr.res.writeHead(HttpStatus.Ok, header);
        param.rr.res.end(html);
    }

}
