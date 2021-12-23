import {SimpleBootHttpSSRFactory} from './SimpleBootHttpSSRFactory';
import {Initializer} from './initializers/Initializer';
import {ConstructorType} from 'simple-boot-core/types/Types';
import {Filter} from './filters/Filter';
import {Advice} from './advices/Advice';
import {HttpServerOption} from './option/HttpServerOption';
import {IncomingMessage, Server, ServerResponse} from 'http';
import {EndPoint} from './endpoints/EndPoint';

export type ReadyParam = {
    filters?: Filter[];
    closeEndPoints?: EndPoint[];
    errorEndPoints?: EndPoint[];
    globalAdvice?: Advice;
    option?: HttpServerOption;
}

export type SimpleBootFrontFactory = { factory: SimpleBootHttpSSRFactory, using: ConstructorType<any>[], domExcludes: ConstructorType<any>[] };

export abstract class SimpleBootHttpSSR {

    constructor(private frontDistPath: string, public simpleBootFrontFactory: SimpleBootFrontFactory, private initializer: Initializer[] = []) {
        // const animals = ['cat', 'dog', 'mouse'] as const
        // type Animal = typeof initializer
    }

    getSimpleBootFrontFactory() {
        return this.simpleBootFrontFactory;
    }

    async run() {
        // const jsDom = await new JsdomInitializer(this.frontDistPath).run();
        const initializers = [];
        for (let initializerElement of this.initializer) {
            initializers.push(await initializerElement.run());
        }
        // const simpleBootFront = await this.simpleBootFrontFactory.factory.createFront(jsDom.window as any, this.simpleBootFrontFactory.using, this.simpleBootFrontFactory.domExcludes);
        const filterAndAdvice = this.onReady(initializers);

        //// start server
        const server = new Server();
        server.on('request', async (req: IncomingMessage, res: ServerResponse) => {
            // const uuid = RandomUtils.uuid();
            try {
                // const rr = new RequestResponse(req, res)
                // const contentLength = Number(req.headers[HttpHeaders.ContentLength.toLowerCase()] ?? '0');
                // console.log('request-> ', 'url:', req.url, 'accept:', req.headers.accept, 'content-length:', req.headers['content-length'], 'uuid:', uuid);
                // before
                if (filterAndAdvice.filters) {
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
                }
                // console.log('before', await this.filterBoot.before(rr));
                // ~~
                // console.log('after', await this.filterBoot.after(rr));
            } catch (e) {
                // console.error('filter error catch call advice', e);
                filterAndAdvice.globalAdvice?.catch(e, req, res);

            }
            res.on('close', () => {
                if (filterAndAdvice.closeEndPoints) {
                    for (const it of filterAndAdvice.closeEndPoints) {
                        try {
                            it.endPoint(req, res);
                        } catch (e) {
                        }
                    }
                }
                // console.log('response-> close', 'url:', req.url, 'status:', res.statusCode, 'uuid:', uuid, filterAndAdvice.closeEndPoints);
            });
            res.on('error', () => {
                if (filterAndAdvice.errorEndPoints) {
                    for (const it of filterAndAdvice.errorEndPoints) {
                        try {
                            it.endPoint(req, res);
                        } catch (e) {
                        }
                    }
                }
                // console.log('response-> error', 'url:', req.url, 'status:', res.statusCode, 'uuid:', uuid);
            });
        });
        server.listen(8081, () => {
            this.startUp(server);
        });
    }

    abstract onReady(initializerReturns: any[]): ReadyParam ;

    abstract startUp(server: Server): void ;

}
