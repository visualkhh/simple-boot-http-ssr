import {IncomingMessage, ServerResponse} from 'http';
import {RequestResponse} from 'simple-boot-http-server/models/RequestResponse';
import {HttpHeaders} from 'simple-boot-http-server/codes/HttpHeaders';
import {SimpleBootHttpSSRFactory} from '../SimpleBootHttpSSRFactory';
import {ConstructorType} from 'simple-boot-core/types/Types';
import {RandomUtils} from 'simple-boot-core/utils/random/RandomUtils';
import {JsdomInitializer} from '../initializers/JsdomInitializer';
import {Filter} from 'simple-boot-http-server/filters/Filter';
import {Mimes} from 'simple-boot-http-server/codes/Mimes';
import {HttpStatus} from 'simple-boot-http-server/codes/HttpStatus';
import {SimpleBootHttpServer} from 'simple-boot-http-server';
import {SimFrontOption} from 'simple-boot-front/option/SimFrontOption';
import {SimpleBootFront} from 'simple-boot-front/SimpleBootFront';
import {Intent} from 'simple-boot-core/intent/Intent';
import {SimAtomic} from 'simple-boot-core/simstance/SimAtomic';

export type SSRFilterOption = {
    frontDistPath: string;
    cacheMiliSecond?: number;
    notFoundUrl?: string;
}
export type FactoryAndParams = {
    factory: SimpleBootHttpSSRFactory;
    using: ConstructorType<any>[];
    domExcludes: ConstructorType<any>[];
}
export class SSRFilter implements Filter {
    private cache = new Map<string, {html: string, createTime: number}>();
    notFoundHtml?: string;
    // public oneRequestStorage: {[key: string]: any} = {};
    // constructor(private simpleBootFront: SimpleBootFront) {
    private rootSimpleBootFront?: SimpleBootFront;
    constructor(private option: SSRFilterOption, public makeSimFrontOption: (window: any) => SimFrontOption,  private factory: FactoryAndParams, public otherInstanceSim: Map<ConstructorType<any>, any>) {
        const jsdom = new JsdomInitializer(this.option.frontDistPath, {url: `http://localhost`}).run();
        const window = jsdom.window as unknown as Window & typeof globalThis;
        (window as any).uuid = 'root-' + RandomUtils.getRandomString(10);
        this.factory.factory.create(this.makeSimFrontOption(window), this.factory.using, this.factory.domExcludes).then(async (it) => {
            this.rootSimpleBootFront = it;
            this.rootSimpleBootFront.run(otherInstanceSim);
            if (this.option.notFoundUrl) {
                const res = await this.rootSimpleBootFront.goRouting(this.option.notFoundUrl);
                this.notFoundHtml = window.document.documentElement.outerHTML;
            }
        });
    }

    async before(req: IncomingMessage, res: ServerResponse, app: SimpleBootHttpServer) {
        // this.clearOneRequestStorage();

        const rr = new RequestResponse(req, res)
        const now = Date.now();
        if (this.rootSimpleBootFront && (rr.reqHasAcceptHeader(Mimes.TextHtml) || rr.reqHasAcceptHeader(Mimes.All))) {
            // notfound catched!!
            const route = await this.rootSimpleBootFront.routing<SimAtomic, any>(new Intent(rr.reqUrl));
            if(!route.module && this.notFoundHtml){
                this.writeOkHtmlAndEnd({rr, status: HttpStatus.NotFound}, this.notFoundHtml);
                return false;
            }

            // cache
            if (this.option.cacheMiliSecond && this.cache.has(rr.reqUrl)) {
                const data = this.cache.get(rr.reqUrl)!;
                if ((now - data.createTime) < this.option.cacheMiliSecond) {
                    this.writeOkHtmlAndEnd({rr}, data.html);
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
            this.writeOkHtmlAndEnd({rr}, html);
            return false;
        } else {
            return true;
        }
    }

    writeOkHtmlAndEnd({rr, status = HttpStatus.Ok}: {rr: RequestResponse, status?: HttpStatus}, html: string) {
        // rr.res.writeHead(status, {[HttpHeaders.ContentType]: Mimes.TextHtml});
        rr.res.statusCode = status;
        rr.res.setHeader(HttpHeaders.ContentType, Mimes.TextHtml);
        rr.res.end(html);
    }
    async after(req: IncomingMessage, res: ServerResponse, app: SimpleBootHttpServer, sw: boolean) {
        // console.log('----------', sw)
        return sw;
    }

}
