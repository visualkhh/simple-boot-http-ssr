import {Filter} from 'simple-boot-http-server/filters/Filter';
import {HttpHeaders} from 'simple-boot-http-server/codes/HttpHeaders';
import {HttpHeaders as SSRHttpHeaders} from '../codes/HttpHeaders';
import {Intent, PublishType} from 'simple-boot-core/intent/Intent';
import {IntentManager} from 'simple-boot-core/intent/IntentManager';
import {Sim} from 'simple-boot-core/decorators/SimDecorator';
import {HttpStatus} from 'simple-boot-http-server/codes/HttpStatus';
import {RequestResponse} from 'simple-boot-http-server/models/RequestResponse';
import {SimpleBootHttpServer} from 'simple-boot-http-server';
import { Mimes } from 'simple-boot-http-server/codes/Mimes';
import { Mimes as SSRMimes } from '../codes/Mimes';



@Sim
export class IntentSchemeFilter implements Filter {
    constructor(private intentManager: IntentManager) {
    }

    async onInit(app: SimpleBootHttpServer) {
    }

    async before(rrr: RequestResponse) {
        const rr = rrr;
        const url = rr.reqUrl;
        const contentLength = Number(rr.reqHeader(HttpHeaders.ContentLength.toLowerCase() ?? '0'));
        if (rr.reqHeader(HttpHeaders.ContentType) === SSRMimes.ApplicationJsonPostSimpleBootSsrIntentScheme && rr.reqHeader(SSRHttpHeaders.XSimpleBootSsrIntentScheme)) {
            let intent = new Intent(`${rr.reqHeader(SSRHttpHeaders.XSimpleBootSsrIntentScheme)}:/${url}`);
            intent.publishType = PublishType.INLINE_DATA_PARAMETERS;
            // const responseHeader = {} as any;
            // responseHeader[HttpHeaders.ContentType] = Mimes.ApplicationJson;
            if (contentLength > 0) {
                intent.data = [await rr.reqBodyJsonData(), rr];
                const rdatas = this.intentManager.publish(intent);
                const rdata = rdatas[0];
                const wdata = rdata instanceof Promise ? await rdata : rdata;
                rr.resStatusCode(HttpStatus.Ok);
                rr.resSetHeader(HttpHeaders.ContentType, [Mimes.ApplicationJson, SSRMimes.ApplicationJsonPostSimpleBootSsrIntentScheme])
                await rr.resEnd(wdata ? JSON.stringify(wdata) : undefined);
            } else {
                intent.data = rr.reqUrlSearchParams.length > 0 ? [rr.reqUrlSearchParamsObj, rr] : [rr];
                const rdatas = this.intentManager.publish(intent);
                const rdata = rdatas[0];
                const wdata = rdata instanceof Promise ? await rdata : rdata;
                rr.resStatusCode(HttpStatus.Ok);
                rr.resSetHeader(HttpHeaders.ContentType, [Mimes.ApplicationJson, SSRMimes.ApplicationJsonPostSimpleBootSsrIntentScheme])
                await rr.resEnd(wdata ? JSON.stringify(wdata) : undefined);
            }
            // console.log('---------3--intent request', rr.req.readable, rr.req.readableLength);
            return false;
        } else {
            return true;
        }
    }

    async after(rr: RequestResponse) {
        return true;
    }

}
