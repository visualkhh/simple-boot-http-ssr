// import {Filter} from '../../simple-boot-http-server/src/filters/Filter';
// import {IncomingMessage, ServerResponse} from 'http';
// import {RequestResponse} from '../models/RequestResponse';
// import {HttpStatus} from '../../../simple-boot-http-server/src/codes/HttpStatus';
// import {ConstructorType} from 'simple-boot-core/types/Types';
// import {RouterManager} from 'simple-boot-core/route/RouterManager';
//
// export type GlobalSimSet = { type: ConstructorType<any>, value: any }
//
// export class RoutingFilter<T extends RequestResponse> implements Filter {
//
//     constructor(private routeManager: RouterManager, public converter = (req: IncomingMessage, res: ServerResponse) => new RequestResponse(req, res) as T) {
//     }
//
//     async before(req: IncomingMessage, res: ServerResponse) {
//         const rr = this.converter(req, res);
//         const intent = rr.reqIntent;
//         const data = await this.routeManager.routing(intent)
//         const moduleInstance = data.getModuleInstance();
//         if (moduleInstance && moduleInstance.onRequest) {
//            const r = moduleInstance.onRequest(rr);
//            if (r instanceof Promise) {
//                await r;
//            }
//             if (!rr.res.finished || !rr.res.writableEnded) {
//                 rr.res.writeHead(HttpStatus.Ok);
//                 rr.res.end();
//             }
//             return false;
//         }
//         return true;
//     }
//
//     async after(req: IncomingMessage, res: ServerResponse) {
//         return true;
//     }
//
//
// }
