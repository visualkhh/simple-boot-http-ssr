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

export type FactoryAndParams = {
    factory: SimpleBootHttpSSRFactory;
    using: ConstructorType<any>[];
    domExcludes: ConstructorType<any>[];
}
export class SSRFilter implements Filter {
    // public oneRequestStorage: {[key: string]: any} = {};
    // constructor(private simpleBootFront: SimpleBootFront) {
    constructor(private frontDistPath: string, public makeSimFrontOption: (window: any) => SimFrontOption,  private factory: FactoryAndParams, public otherInstanceSim: Map<ConstructorType<any>, any>) {
    }

    async before(req: IncomingMessage, res: ServerResponse, app: SimpleBootHttpServer) {
        // this.clearOneRequestStorage();

        const rr = new RequestResponse(req, res)
        // if ((rr.req.headers.accept ?? Mimes.TextHtml).indexOf(Mimes.TextHtml) >= 0) {
        if (rr.reqHasAcceptHeader(Mimes.TextHtml)) {
            const jsdom = new JsdomInitializer(this.frontDistPath, {url: `http://localhost${rr.reqUrl}`}).run();
            const window = jsdom.window as unknown as Window & typeof globalThis;
            (window as any).uuid = RandomUtils.getRandomString(10);
            // app.intentManager.simstanceManager.getOrNewSim(SimFrontOption)
            // const ssrApp = app as SimpleBootHttpSSRServer;
            const option = this.makeSimFrontOption(window)
            const simpleBootFront = await this.factory.factory.create(option, this.factory.using, this.factory.domExcludes);
            // app.simstanceManager.set(SimFrontOption, simpleBootFront.option);
            // simpleBootFront.regDoneRouteCallBack(this);
            // simpleBootFront.pushDoneRouteCallBack(this, {rr, window});
            const data = await simpleBootFront.runRouting(this.otherInstanceSim);

            //////////////

            const aroundStorage = (window as any).aroundStorage;
            // console.log('ssrfilter uuid after -->');
            let html = window.document.documentElement.outerHTML;
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
            rr.res.writeHead(HttpStatus.Ok, header);
            rr.res.end(html);
            return false;
        } else {
            return true;
        }
    }

    async after(req: IncomingMessage, res: ServerResponse, app: SimpleBootHttpServer) {
        return true;
    }

}
