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
    frontDistIndexFileName?: string;
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
    private simpleBootFrontPool: SimpleBootFront[] = [];
    private simpleBootFrontQueue = new AsyncBlockingQueue<SimpleBootFront>();
    private indexHTML: string;
    private welcomUrl = 'http://localhost'
    constructor(private factory: FactoryAndParams, public otherInstanceSim?: Map<ConstructorType<any>, any>) {
        factory.frontDistIndexFileName = factory.frontDistIndexFileName || 'index.html';
        this.indexHTML = JsdomInitializer.loadFile(this.factory.frontDistPath, factory.frontDistIndexFileName);
    }

    async onInit(app: SimpleBootHttpServer) {
        for (let i = 0; i < this.factory.poolOption.min; i++) {
            await this.pushQueue()
        }
    }

    async pushQueue() {
        if (this.simpleBootFrontPool.length < this.factory.poolOption.max) {
            const idx = this.simpleBootFrontPool.length
            const jsdom = await new JsdomInitializer(this.factory.frontDistPath, this.factory.frontDistIndexFileName || 'index.html', {url: this.welcomUrl}).run();
            const window = jsdom.window as unknown as Window & typeof globalThis;
            (window as any).ssrUse = false;
            const option = this.factory.factorySimFrontOption(window);
            option.name = `SSRFilter-pool-${idx + 1}`
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
        if ((rr.reqHasAcceptHeader(Mimes.TextHtml) || rr.reqHasAcceptHeader(Mimes.All))) {
            if (this.factory.ssrExcludeFilter?.(rr)) {
                this.writeOkHtmlAndEnd({rr}, this.indexHTML);
                return false;
            }
            if (this.simpleBootFrontQueue.isEmpty()) {
                await this.pushQueue();
            }
            const simpleBootFront = await this.simpleBootFrontQueue.dequeue();
            try {
                // console.log('SSRFilter before-->' , simpleBootFront.option.name, 'poolLength:',this.simpleBootFrontPool.length);
                (simpleBootFront.option.window as any).ssrUse = true;
                delete (simpleBootFront.option.window as any).server_side_data;

                // runRouting!!
                await simpleBootFront.goRouting(rr.reqUrl);
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
                    if (data) {
                        html = html.replace('</head>', `<script> window.server_side_data={}; ${data}; </script></head>`);
                    }
                }

                await this.writeOkHtmlAndEnd({rr}, html);
            } finally {
                (simpleBootFront.option.window as any).ssrUse = false;
                delete (simpleBootFront.option.window as any).server_side_data;
                simpleBootFront.option.window.location.href = this.welcomUrl;
                this.simpleBootFrontQueue.enqueue(simpleBootFront);
            }
            return false;
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
