import {SimpleBootHttpSSRFactory} from './SimpleBootHttpSSRFactory';
import {JsdomInitializer} from './initializers/JsdomInitializer';
import {Initializer} from './initializers/Initializer';
import {SimpleBootFront} from 'simple-boot-front/SimpleBootFront';
import * as JSDOM from 'jsdom';
import {ConstructorType} from 'simple-boot-core/types/Types';
import {Filter} from './filters/Filter';
import {Advice} from './advices/Advice';
import {HttpServerOption} from './option/HttpServerOption';
import {IncomingMessage, Server, ServerResponse} from 'http';
import {RandomUtils} from 'simple-boot-core/utils/random/RandomUtils';

export abstract class SimpleBootHttpSSR {

    constructor(private frontDistPath: string, private simpleBootFrontFactory: {factory: SimpleBootHttpSSRFactory, using: ConstructorType<any>[], domExcludes: ConstructorType<any>[]}, private initializer: Initializer[] = []) {
        // const animals = ['cat', 'dog', 'mouse'] as const
        // type Animal = typeof initializer
    }

    async run() {
        const jsDom = await new JsdomInitializer(this.frontDistPath).run();
        const initializers = [];
        for (let initializerElement of this.initializer) {
            initializers.push(await initializerElement.run());
        }
        const s = await this.simpleBootFrontFactory.factory.createFront(window, this.simpleBootFrontFactory.using, this.simpleBootFrontFactory.domExcludes);
        const filterAndAdvice = this.onReady(jsDom, s, initializers);

        //// start server
        const server = new Server();
        server.on('request', async (req: IncomingMessage, res: ServerResponse) => {
            const uuid = RandomUtils.uuid();
            try {
                // const rr = new RequestResponse(req, res)
                // const contentLength = Number(req.headers[HttpHeaders.ContentLength.toLowerCase()] ?? '0');
                console.log('request-> ', 'url:', req.url, 'accept:', req.headers.accept, 'content-length:', req.headers['content-length'], 'uuid:', uuid);
                // before
                for (const it of filterAndAdvice.filters) {
                    if (!await it.before(req, res)) {
                        break;
                    }
                }

                // body.. something..

                // after
                for (const it of filterAndAdvice.filters.slice().reverse()) {
                    if (!await it.after(req, res)) {
                        break;
                    }
                }
                // console.log('before', await this.filterBoot.before(rr));
                // ~~
                // console.log('after', await this.filterBoot.after(rr));
            } catch (e) {
                console.error('filter error---', e);
                const c = await filterAndAdvice.globalAdvice.catch(e, req, res);
            }
            res.on('close', () => {
                console.log('response-> close', 'url:', req.url, 'status:', res.statusCode, 'uuid:', uuid);
            });
            res.on('error', () => {
                console.log('response-> error', 'url:', req.url, 'status:', res.statusCode, 'uuid:', uuid);
            });
        });
        server.listen(8081, () => {
            this.startUp(server);
        });
    }
    abstract onReady(jsDom: JSDOM.JSDOM, simpleBootFront: SimpleBootFront, initializerReturns: any[]): {filters: Filter[], globalAdvice: Advice, option: HttpServerOption} ;
    abstract startUp(server: Server): void ;

}
