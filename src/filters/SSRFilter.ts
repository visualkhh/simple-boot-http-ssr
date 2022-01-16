import {IncomingMessage, ServerResponse} from 'http';
import {RequestResponse} from 'simple-boot-http-server/models/RequestResponse';
import {HttpHeaders} from 'simple-boot-http-server/codes/HttpHeaders';
import { SimpleBootHttpSSRFactory } from '../SimpleBootHttpSSRFactory';
import { ConstructorType } from 'simple-boot-core/types/Types';
import { RandomUtils } from 'simple-boot-core/utils/random/RandomUtils';
import {JsdomInitializer} from '../initializers/JsdomInitializer';
import {RouterModule} from 'simple-boot-core/route/RouterModule';
import { Filter } from 'simple-boot-http-server/filters/Filter';
import { Mimes } from 'simple-boot-http-server/codes/Mimes';
import { HttpStatus } from 'simple-boot-http-server/codes/HttpStatus';
import { SimpleBootHttpServer } from 'simple-boot-http-server';
import { SimFrontOption } from 'simple-boot-front/option/SimFrontOption';
export type SSRFilterOption = {
    frontDistPath: string;
    cacheMiliSecond?: number;
}
export type FactoryAndParams = {
    factory: SimpleBootHttpSSRFactory;
    using: ConstructorType<any>[];
    domExcludes: ConstructorType<any>[];
}
export class SSRFilter implements Filter {
    private cache = new Map<string, {html: string, createTime: number}>();
    // public oneRequestStorage: {[key: string]: any} = {};
    // constructor(private simpleBootFront: SimpleBootFront) {
    constructor(private option: SSRFilterOption, public makeSimFrontOption: (window: any) => SimFrontOption,  private factory: FactoryAndParams, public otherInstanceSim: Map<ConstructorType<any>, any>) {
    }

    async before(req: IncomingMessage, res: ServerResponse, app: SimpleBootHttpServer) {
        // this.clearOneRequestStorage();

        const rr = new RequestResponse(req, res)
        const now = Date.now();
        if (rr.reqHasAcceptHeader(Mimes.TextHtml)) {
            // cache
            if (this.option.cacheMiliSecond && this.cache.has(rr.reqUrl)) {
                const data = this.cache.get(rr.reqUrl)!;
                if ((now - data.createTime) < this.option.cacheMiliSecond) {
                    this.writeOkHtmlAndEnd(rr, data.html);
                    return false;
                }
            }
            const jsdom = new JsdomInitializer(this.option.frontDistPath, {url: `http://localhost${rr.reqUrl}`}).run();
            const window = jsdom.window as unknown as Window & typeof globalThis;
            (window as any).uuid = RandomUtils.getRandomString(10);
            const option = this.makeSimFrontOption(window)
            const simpleBootFront = await this.factory.factory.create(option, this.factory.using, this.factory.domExcludes);
            const data = await simpleBootFront.runRouting(this.otherInstanceSim);
            //////////////
            const aroundStorage = (window as any).aroundStorage;
            let html = window.document.documentElement.outerHTML;
            this.cache.set(rr.reqUrl, {html, createTime: now});
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
            this.writeOkHtmlAndEnd(rr, html);
            return false;
        } else {
            return true;
        }
    }

    writeOkHtmlAndEnd(rr: RequestResponse, html: string) {
        rr.res.writeHead(HttpStatus.Ok, {[HttpHeaders.ContentType]: Mimes.TextHtml});
        rr.res.end(html);
    }
    async after(req: IncomingMessage, res: ServerResponse, app: SimpleBootHttpServer, sw: boolean) {
        // console.log('----------', sw)
        return sw;
    }

}
