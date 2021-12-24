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
import {SimConfig} from 'simple-boot-core/decorators/SimDecorator';

export class SSRFilter implements Filter, OnDoneRoute {

    // constructor(private simpleBootFront: SimpleBootFront) {
    constructor(private frontDistPath: string, private factory: SimpleBootFrontFactory, public otherInstanceSim: Map<ConstructorType<any>, any>) {
    }

    async before(req: IncomingMessage, res: ServerResponse) {
        const rr = new RequestResponse(req, res)
        // if ((rr.req.headers.accept ?? Mimes.TextHtml).indexOf(Mimes.TextHtml) >= 0) {
        if (rr.reqHasAcceptHeader(Mimes.TextHtml)) {
            const jsdom = await new JsdomInitializer(this.frontDistPath, {url: `http://localhost${rr.reqUrl}`}).run();
            const window = jsdom.window as unknown as Window & typeof globalThis;
            (window as any).uuid = RandomUtils.getRandomString(10);
            const simpleBootFront = await this.factory.factory.createFront(window as any, this.factory.using, this.factory.domExcludes);
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
        console.log('ssrfilter uuid after -->', routerModule);
        const data = routerModule.onRouteDatas.filter(it => it.simAtomic.getConfig<SimConfig>()?.scheme && it.onRouteData).map(it => {
            return `window.localStorage.setItem('${it.simAtomic.getConfig<SimConfig>()?.scheme}', '${JSON.stringify(it.onRouteData)}')`;
        }).join(';');
        let html = param.window.document.documentElement.outerHTML;
        if(data) {
            html = html.replace('</body>', `<script>${data}</script></body>`);
        }
        const header = {} as any;
        header[HttpHeaders.ContentType] = Mimes.TextHtml;
        param.rr.res.writeHead(HttpStatus.Ok, header);
        param.rr.res.end(html);
    }

}
