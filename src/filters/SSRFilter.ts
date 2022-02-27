import {RequestResponse} from 'simple-boot-http-server/models/RequestResponse';
import {HttpHeaders} from 'simple-boot-http-server/codes/HttpHeaders';
import {SimpleBootHttpSSRFactory} from '../SimpleBootHttpSSRFactory';
import {ConstructorType} from 'simple-boot-core/types/Types';
import {JsdomInitializer} from '../initializers/JsdomInitializer';
import {Filter} from 'simple-boot-http-server/filters/Filter';
import {Mimes} from 'simple-boot-http-server/codes/Mimes';
import {HttpStatus} from 'simple-boot-http-server/codes/HttpStatus';
import {SimpleBootHttpServer} from 'simple-boot-http-server';
import {SimFrontOption} from 'simple-boot-front/option/SimFrontOption';
import {SimpleBootFront} from 'simple-boot-front/SimpleBootFront';
import {AsyncBlockingQueue} from 'simple-boot-core/queues/AsyncBlockingQueue';

export type FactoryAndParams = {
    frontDistPath: string;
    factorySimFrontOption: (window: any) => SimFrontOption;
    factory: SimpleBootHttpSSRFactory;
    poolOption: {
        max: number;
        min: number;
    }
    using: ConstructorType<any>[];
    domExcludes: ConstructorType<any>[];
    ssrExcludeFilter?: (rr: RequestResponse) => boolean;
}
export class SSRFilter implements Filter {
    // private cache = new Map<string, {html: string, createTime: number}>();
    // notFoundHtml?: string;
    // public oneRequestStorage: {[key: string]: any} = {};
    // constructor(private simpleBootFront: SimpleBootFront) {
    // private rootSimpleBootFront?: SimpleBootFront;
    private simpleBootFrontPool: SimpleBootFront[] = [];
    // private simpleBootFrontQueue: Promise<SimpleBootFront>[] = [];
    private simpleBootFrontQueue = new AsyncBlockingQueue<SimpleBootFront>();
    // private detectPool: Generator<null, void, SimpleBootFront> = function* (pool: SimpleBootFront[], queue: AsyncBlockingQueue<SimpleBootFront>) {
    //     while (true) {
    //         const data = yield null;
    //         // if (this.simpleBootFrontPool.length > 0) {
    //         //     yield this.simpleBootFrontPool.shift();
    //         // } else {
    //         //     yield new SimpleBootFront();
    //         // }
    //     }
    // }(this.simpleBootFrontPool, this.simpleBootFrontQueue);
    private indexHTML: string;
    constructor(private factory: FactoryAndParams, public otherInstanceSim: Map<ConstructorType<any>, any>) {
        (async () => {
            for (let i = 0; i < this.factory.poolOption.min; i++) {
                await this.pushQueue()
            }
        })().then(it => {
            // console.log('SSRFilter init');
        });
        this.indexHTML = JsdomInitializer.loadFile(this.factory.frontDistPath, 'index.html');
    }

    async pushQueue() {
        if (this.simpleBootFrontPool.length < this.factory.poolOption.max) {
            const idx = this.simpleBootFrontPool.length
            const jsdom = new JsdomInitializer(this.factory.frontDistPath, {url: `http://localhost`}).run();
            const window = jsdom.window as unknown as Window & typeof globalThis;
            (window as any).ssrUse = false;
            const option = this.factory.factorySimFrontOption(window);
            option.name = `SSRFilter-pool-${idx+1}`
            const simpleBootFront = await this.factory.factory.create(option, this.factory.using, this.factory.domExcludes);
            simpleBootFront.run(this.otherInstanceSim);
            this.simpleBootFrontPool.push(simpleBootFront);
            this.simpleBootFrontQueue.enqueue(simpleBootFront);
        }
    }

    async before(rr: RequestResponse) {
        // const now = Date.now();
        // console.log('SSRFilter before start===================', this.simpleBootFrontQueue.isEmpty(), this.simpleBootFrontPool.length, now);
        // 무조건 promise로 await 해야 함
        // this.clearOneRequestStorage();
        // this.simpleBootFrontQueue.enqueue()
        if ((rr.reqHasAcceptHeader(Mimes.TextHtml) || rr.reqHasAcceptHeader(Mimes.All))) {
            if (this.factory.ssrExcludeFilter?.(rr)) {
                this.writeOkHtmlAndEnd({rr}, this.indexHTML);
                return false;
            }
            if (this.simpleBootFrontQueue.isEmpty()) {
                await this.pushQueue();
            }
            const simpleBootFront = await this.simpleBootFrontQueue.dequeue();
            // notfound catched!!
            // const route = await this.rootSimpleBootFront.routing<SimAtomic, any>(new Intent(rr.reqUrl));
            // if(!route.module && this.notFoundHtml){
            //     this.writeOkHtmlAndEnd({rr, status: HttpStatus.NotFound}, this.notFoundHtml);
            //     return false;
            // }
            //
            // // cache
            // if (this.option.cacheMiliSecond && this.cache.has(rr.reqUrl)) {
            //     const data = this.cache.get(rr.reqUrl)!;
            //     if ((now - data.createTime) < this.option.cacheMiliSecond) {
            //         this.writeOkHtmlAndEnd({rr}, data.html);
            //         return false;
            //     }
            // }

            // const rootTimerLabel = 'rootTimerLabel';
            // console.time(rootTimerLabel);
            // const data = await this.rootSimpleBootFront.runRouting(this.otherInstanceSim, rr.reqUrl);
            try {
                // console.log('SSRFilter before-->' , simpleBootFront.option.name, 'poolLength:',this.simpleBootFrontPool.length);
                (simpleBootFront.option.window as any).ssrUse = true;
                delete (simpleBootFront.option.window as any).server_side_data;

                //runRouting!!
                const data = await simpleBootFront.goRouting(rr.reqUrl);
                let html = simpleBootFront.option.window.document.documentElement.outerHTML;

                const serverSideData = (simpleBootFront.option.window as any).server_side_data;
                if (serverSideData) {
                    const data = Object.entries(serverSideData).map(([k, v]) => {
                        if (typeof v === 'string') {
                            return `window.server_side_data.${k} = ${v}`;
                        } else {
                            return `window.server_side_data.${k} = ${JSON.stringify(v)}`;
                        }
                    }).join(';');
                    if(data) {
                        html = html.replace('</head>', `<script> window.server_side_data={}; ${data}; </script></head>`);
                    }
                }

                await this.writeOkHtmlAndEnd({rr}, html);
            } finally {
                (simpleBootFront.option.window as any).ssrUse = false;
                delete (simpleBootFront.option.window as any).server_side_data;
                this.simpleBootFrontQueue.enqueue(simpleBootFront);
            }
            // console.timeEnd(rootTimerLabel);
            return false;
            // const jsDomTimerLabel = 'jsDomTimerLabel';
            // const frontTimerLabel = 'frontTimerLabel';
            // const frontRoutingTimerLabel = 'frontRoutingTimerLabel';
            // console.time(jsDomTimerLabel);
            // const jsdom = new JsdomInitializer(this.option.frontDistPath, {url: `http://localhost${rr.reqUrl}`}).run();
            // console.timeEnd(jsDomTimerLabel);
            //
            // console.time(frontTimerLabel);
            // const window = jsdom.window as unknown as Window & typeof globalThis;
            // (window as any).uuid = RandomUtils.getRandomString(10);
            // const option = this.makeSimFrontOption(window)
            // const simpleBootFront = await this.factory.factory.create(option, this.factory.using, this.factory.domExcludes);
            // console.timeEnd(frontTimerLabel);
            //
            // console.time(frontRoutingTimerLabel);
            // const data = await simpleBootFront.runRouting(this.otherInstanceSim);
            // //////////////
            // const aroundStorage = (window as any).aroundStorage;
            // let html = window.document.documentElement.outerHTML;
            // this.cache.set(rr.reqUrl, {html, createTime: now});
            //
            // if (aroundStorage) {
            //     const data = Object.entries(aroundStorage).map(([k, v]) => {
            //         if (typeof v === 'string') {
            //             return `window.localStorage.setItem('${k}', '${v}')`;
            //         } else {
            //             return `window.localStorage.setItem('${k}', '${JSON.stringify(v)}')`;
            //         }
            //     }).join(';');
            //     if(data) {
            //         html = html.replace('</body>', `<script>${data}</script></body>`);
            //     }
            // }
            // console.timeEnd(frontRoutingTimerLabel);

        } else {
            return true;
        }
    }

    async writeOkHtmlAndEnd({rr, status = HttpStatus.Ok}: {rr: RequestResponse, status?: HttpStatus}, html: string) {
        // rr.res.writeHead(status, {[HttpHeaders.ContentType]: Mimes.TextHtml});
        rr.resStatusCode(status);
        rr.resSetHeader(HttpHeaders.ContentType, Mimes.TextHtml);
        await rr.resEnd(html);
    }

    async after(rr: RequestResponse, app: SimpleBootHttpServer, sw: boolean) {
        // console.log('----------', sw)
        return sw;
    }

}
