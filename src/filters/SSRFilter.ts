import { Filter } from '../filters/Filter';
import { Mimes } from '../codes/Mimes';
import { Navigation } from 'simple-boot-front/service/Navigation';
import {IncomingMessage, ServerResponse} from 'http';
import {RequestResponse} from '../models/RequestResponse';
import {SimpleBootFront} from 'simple-boot-front/SimpleBootFront';
import {HttpStatus} from '../codes/HttpStatus';
import {HttpHeaders} from '../codes/HttpHeaders';
import { OnDoneRoute } from 'simple-boot-front/route/OnDoneRoute';
import { SimpleBootHttpSSRFactory } from '../SimpleBootHttpSSRFactory';
import { SimpleBootFrontFactory } from '../SimpleBootHttpSsr';
import fs from 'fs';
import path from 'path';
import JSDOM from 'jsdom';
import { ConstructorType } from 'simple-boot-core/types/Types';
import { RandomUtils } from 'simple-boot-core/utils/random/RandomUtils';
import {JsdomInitializer} from '../initializers/JsdomInitializer';
import {RouterModule} from 'simple-boot-core/route/RouterModule';
import { getSim, SimConfig } from 'simple-boot-core/decorators/SimDecorator';


export class SSRFilter implements Filter, OnDoneRoute {
    // public oneRequestStorage: {[key: string]: any} = {};
    // constructor(private simpleBootFront: SimpleBootFront) {
    constructor(private frontDistPath: string, private factory: SimpleBootFrontFactory, public otherInstanceSim: Map<ConstructorType<any>, any>) {
    }

    // clearOneRequestStorage(key?: string) {
    //     if (key) {
    //         delete this.oneRequestStorage[key];
    //     } else {
    //         this.oneRequestStorage = {};
    //     }
    // }

    async before(req: IncomingMessage, res: ServerResponse) {
        // this.clearOneRequestStorage();

        const rr = new RequestResponse(req, res)
        // if ((rr.req.headers.accept ?? Mimes.TextHtml).indexOf(Mimes.TextHtml) >= 0) {
        if (rr.reqHasAcceptHeader(Mimes.TextHtml)) {
            const jsdom = await new JsdomInitializer(this.frontDistPath, {url: `http://localhost${rr.reqUrl}`}).run();
            const window = jsdom.window as unknown as Window & typeof globalThis;
            (window as any).uuid = RandomUtils.getRandomString(10);
            const simpleBootFront = await this.factory.factory.create(window as any, this.factory.using, this.factory.domExcludes);
            simpleBootFront.regDoneRouteCallBack(this);
            simpleBootFront.pushDoneRouteCallBack(this, {rr, window});
            simpleBootFront.run(this.otherInstanceSim);
            return false;
        } else {
            return true;
        }
    }

    async after(req: IncomingMessage, res: ServerResponse) {
        return true;
    }

    onDoneRoute(routerModule: RouterModule, param: {rr: RequestResponse, window: Window}): void {
        const aroundStorage = (window as any).aroundStorage;
        // console.log('ssrfilter uuid after -->');
        let html = param.window.document.documentElement.outerHTML;
        if (aroundStorage) {
            const data = Object.entries(aroundStorage).map(([k, v]) => {
                    return `window.localStorage.setItem('${k}', '${JSON.stringify(v)}')`;
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
