import {SimpleApplication} from 'simple-boot-core/SimpleApplication';
import {HttpServerOption} from './option/HttpServerOption';
import {ConstructorType} from 'simple-boot-core/types/Types';
import {Intent} from 'simple-boot-core/intent/Intent';
import {URL} from 'url';
import {IncomingMessage, Server, ServerResponse} from 'http'
import {FrontRouter} from 'simple-boot-front/router/FrontRouter';
import fs from 'fs';
import path from 'path';
import {FrontModule} from 'simple-boot-front/module/FrontModule';
import {SimFrontOption} from 'simple-boot-front/option/SimFrontOption';
import {HttpModule} from './module/HttpModule';
import {DOMWindow, JSDOM} from 'jsdom';
import {TargetNode, TargetNodeMode} from "dom-render/RootScope";

declare var window: DOMWindow;
declare var document: Document;
(global as any).window = new JSDOM('<html><body id="app"></body></html>').window;
(global as any).document = (global as any).window.document;
export class SimpleBootHttpSsr extends SimpleApplication {
    constructor(public rootRouter: ConstructorType<FrontRouter>, public frontOption: SimFrontOption, public option: HttpServerOption = new HttpServerOption()) {
        super(rootRouter, option);
        this.simstanceManager.storage.set(SimFrontOption, this.frontOption);
    }

    public run() {
        super.run();
        const server = this.option.serverOption ? new Server(this.option.serverOption) : new Server();
        server.on('request', (req: IncomingMessage, res: ServerResponse) => {
            const url = new URL(req.url!, 'http://' + req.headers.host);
            const intent = new Intent(req.url ?? '', url);
            const simpleboothttpssr = url.searchParams.get('simpleboothttpssr');
            const targetPath = url.searchParams.get('path');
            const isRouter = url.searchParams.get('router');

            console.log('--22>', req.headers.accept)
            if (simpleboothttpssr === 'true') {
                this.routing(intent).then(it => {
                    let triggerModule: FrontModule | undefined;
                    if (isRouter === 'true') {
                        const s = this.simstanceManager;
                        triggerModule = s.getOrNewSim(it.router?.module) as FrontModule;
                    } else {
                        triggerModule = it.getModuleInstance();
                    }

                    if (triggerModule instanceof FrontModule && triggerModule._inputOption.name && targetPath) {
                        fs.readFile(path.join(triggerModule._inputOption.name, targetPath), (err, data) => {
                            if (err) {
                                res.writeHead(404);
                                res.end(JSON.stringify(err));
                                return;
                            }
                            res.writeHead(200);
                            res.end(data);
                        });

                        // fs.promises.readFile(path.join(triggerModule._inputOption.name, targetPath), 'utf8').then(sit => {
                        //     res.writeHead(200);
                        //     res.end(sit);
                        // })
                    } else if (triggerModule instanceof HttpModule) {
                        triggerModule.receive(req, res);
                    } else {
                        res.writeHead(404);
                        res.end();
                    }
                    // console.log('-->>>>>', trigger)
                    // console.log('-->>>>>>>>module', it.module?.name)
                    // console.log('-->>>>>>>>router', it.router?.module?.name)
                    // if (it.module?.name === trigger) {
                    //
                    // } else if (it.router?.counstructor.name === trigger) {
                    //
                    // }
                    //
                    // const moduleInstance = it.getModuleInstance<FrontModule>() as FrontModule;
                    // (moduleInstance as FrontModule).init().then(sit => {
                    //     console.log('---->', sit, intent);
                    // })
                    // console.log('-->', moduleInstance);
                }).catch(it => {
                    console.log('catcddh-->', it, intent)
                })
            } else if (simpleboothttpssr === 'xx') {
                console.log('--xx');
                (global as any).window = new JSDOM('<html><body id="app"></body></html>').window;
                (global as any).document = (global as any).window.document;
                this.routing<FrontRouter, FrontModule>(intent).then(async it => {
                    let lastRouterSelector = this.frontOption?.selector;
                    for (const routerChain of it.routerChains) {
                        const moduleObj = this.simstanceManager?.getOrNewSim(routerChain.module);
                        if (moduleObj instanceof FrontModule) {
                            const option = await (moduleObj as FrontModule).init({router: 'true'});
                            if (!document.querySelector(`[module-id='${moduleObj?.id}']`)) {
                                this.render(moduleObj, document.querySelector(lastRouterSelector!));
                            }
                            if (moduleObj?._router_outlet_id) {
                                lastRouterSelector = '#' + moduleObj?._router_outlet_id;
                            } else {
                                lastRouterSelector = '#' + moduleObj?.id;
                            }
                        }
                    }

                    // Module render
                    const module = it.getModuleInstance();
                    const option = await module.init();
                    this.render(module, document.querySelector(lastRouterSelector!));
                    (module as any)._onInitedChild();
                    it.routerChains.reverse().forEach(it => (this.simstanceManager?.getOrNewSim(it.module) as any)?._onInitedChild());
                    // console.log(document.body.innerHTML)
                    res.writeHead(200);
                    res.end(document.documentElement.outerHTML);
                })
            } else {
                // console.log('file-->', this.option.publicPath, req.url)
                // fs.readFile(path.join(this.option.publicPath, (req.url === '/' ? '/index.html' : req.url) ?? ''), (err, data) => {

                const paths = !(req.url?.endsWith('js') || req.url?.endsWith('map')) ? '/index.html' : req.url ?? '';
                fs.readFile(path.join(this.option.publicPath, paths), (err, data) => {
                    if (err) {
                        res.writeHead(404);
                        res.end(JSON.stringify(err));
                        return;
                    }
                    res.writeHead(200);
                    res.end(data);
                });
            }
        });
        server.listen(this.option.listen.port, this.option.listen.hostname, this.option.listen.backlog, this.option.listen.listeningListener)
    }
    /////////
    public render(module: FrontModule | undefined, targetSelector: Node | null): boolean {
        if (module && targetSelector) {
            (module as any)._onInit()
            module.setScope(new TargetNode(targetSelector, TargetNodeMode.child))
            module.renderWrap();
            return true
        } else {
            return false
        }
    }
}
