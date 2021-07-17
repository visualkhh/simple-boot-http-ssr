import {Sim} from 'simple-boot-core/decorators/SimDecorator';
import {HttpModule} from 'simple-boot-http-ssr/module/HttpModule';
import {IncomingMessage, ServerResponse} from 'http';

@Sim({})
export class ServerIndex extends HttpModule {

    receive(req: IncomingMessage, res: ServerResponse) {
        req.on('data', chunk => {
            console.log('-->', chunk.toString());
        });
        req.on('end', () => {
            res.end('ok');
        });
    }
}
