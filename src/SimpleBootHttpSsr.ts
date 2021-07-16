import {SimpleApplication} from 'simple-boot-core/SimpleApplication';
import {HttpServerOption} from './option/HttpServerOption';
import {ConstructorType} from 'simple-boot-core/types/Types';
import {Intent} from 'simple-boot-core/intent/Intent';
import {URL} from 'url';
import {IncomingMessage, Server, ServerResponse} from 'http'
import {FrontRouter} from '../simple-boot-front/src/router/FrontRouter';

export class SimpleBootHttpSsr extends SimpleApplication {
    constructor(public rootRouter: ConstructorType<FrontRouter>, public option: HttpServerOption = new HttpServerOption()) {
        super(rootRouter, option);
    }

    public run() {
        super.run();
        const server = this.option.serverOption ? new Server(this.option.serverOption) : new Server();
        server.on('request', (req: IncomingMessage, res: ServerResponse) => {

            if (req.headers.accept === 'application/vnd.simple-boot-http-ssr') {
                console.log('-->', req.headers.accept)

                const url = new URL(req.url!, 'http://' + req.headers.host);
                const intent = new Intent(req.url ?? '', url);
                this.routing(intent).then(it => {
                    //it.getModuleInstance<HttpModule>()?.receive(req, res);
                }).catch(it => {
                    console.log('catch-->', it)
                })
            } else {
                console.log('file-->', __dirname + req.url)
                // readFile(__dirname + req.url, (err, data) => {
                //     if (err) {
                //         res.writeHead(404);
                //         res.end(JSON.stringify(err));
                //         return;
                //     }
                //     res.writeHead(200);
                //     res.end(data);
                // });
            }
        });
        server.listen(this.option.listen.port, this.option.listen.hostname, this.option.listen.backlog, this.option.listen.listeningListener)
    }
}
