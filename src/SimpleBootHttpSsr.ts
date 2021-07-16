import {SimpleApplication} from 'simple-boot-core/SimpleApplication';
import {HttpServerOption} from './option/HttpServerOption';
import {ConstructorType} from 'simple-boot-core/types/Types';
import {Intent} from 'simple-boot-core/intent/Intent';
import {URL} from 'url';
import {IncomingMessage, Server, ServerResponse} from 'http'
import {FrontRouter} from '../simple-boot-front/src/router/FrontRouter';
import fs from 'fs';
import path from 'path';
import {FrontModule} from 'simple-boot-front/module/FrontModule';
import {SimFrontOption} from 'simple-boot-front/option/SimFrontOption';
// const a = require('')
export class SimpleBootHttpSsr extends SimpleApplication {
    constructor(public rootRouter: ConstructorType<FrontRouter>, public frontOption: SimFrontOption, public option: HttpServerOption = new HttpServerOption()) {
        super(rootRouter, option);
        this.simstanceManager.storage.set(SimFrontOption, this.frontOption);
    }

    public run() {
        super.run();
        const server = this.option.serverOption ? new Server(this.option.serverOption) : new Server();
        server.on('request', (req: IncomingMessage, res: ServerResponse) => {
            console.log('--22>', req.headers.accept)
            if (req.headers.accept === 'application/vnd.simple-boot-http-ssr') {
                const url = new URL(req.url!, 'http://' + req.headers.host);
                const intent = new Intent(req.url ?? '', url);
                this.routing(intent).then(it => {
                    const moduleInstance = it.getModuleInstance<FrontModule>() as FrontModule;
                    (moduleInstance as FrontModule).init().then(sit => {
                        console.log('---->', sit, intent);
                    })
                    // console.log('-->', moduleInstance);
                }).catch(it => {
                    console.log('catcddh-->', it, intent)
                })
            } else {
                // console.log('file-->', this.option.publicPath, req.url)
                fs.readFile(path.join(this.option.publicPath, (req.url === '/' ? '/index.html' : req.url) ?? ''), (err, data) => {
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
}
