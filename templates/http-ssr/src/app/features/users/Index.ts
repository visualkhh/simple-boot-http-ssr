// import {HttpModule} from 'simple-boot-http-ssr/module/HttpModule';
// import {IncomingMessage, ServerResponse} from 'http';
// import {Sim} from 'simple-boot-core/decorators/SimDecorator';
//
// @Sim({})
// export class Index extends HttpModule {
//     receive(req: IncomingMessage, res: ServerResponse) {
//         console.log('request', req.url, req.method)
//         res.writeHead(200, {'Content-Type': 'text/plain'});
//         res.write('user index\n\n');
//         let text = 'Create Server test\n';
//         text += 'Server running at http://localhost:8081/ \n';
//         res.end(text);
//     }
// }