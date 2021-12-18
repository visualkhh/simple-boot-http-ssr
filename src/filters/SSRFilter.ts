import { Filter } from '../filters/Filter';
import { Mimes } from '../codes/Mimes';
import { Navigation } from 'simple-boot-front/service/Navigation';
import {IncomingMessage, ServerResponse} from 'http';
import {RequestResponse} from '../models/RequestResponse';
import {SimpleBootFront} from 'simple-boot-front/SimpleBootFront';
import {HttpStatus} from '../codes/HttpStatus';
import {HttpHeaders} from '../codes/HttpHeaders';
import { OnDoneRoute } from 'simple-boot-front/route/OnDoneRoute';

export class SSRFilter implements Filter, OnDoneRoute {
    private navigation: Navigation;

    constructor(private simpleBootFront: SimpleBootFront) {
        this.navigation = simpleBootFront.getSimstanceManager().getOrNewSim(Navigation)!
        this.simpleBootFront.regDoneRouteCallBack(this);
    }

    async before(req: IncomingMessage, res: ServerResponse) {
        const rr = new RequestResponse(req, res)
        // if ((rr.req.headers.accept ?? Mimes.TextHtml).indexOf(Mimes.TextHtml) >= 0) {
        if (rr.reqHasAcceptHeader(Mimes.TextHtml)) {
            this.simpleBootFront.pushDoneRouteCallBack(this, rr);
            this.navigation.go(rr.reqUrl);
            return false;
        } else {
            return true;
        }
    }

    async after(req: IncomingMessage, res: ServerResponse) {
        return true;
    }

    onDoneRoute(rr: RequestResponse): void {
        const header = {} as any;
        header[HttpHeaders.ContentType] = Mimes.TextHtml;
        rr.res.writeHead(HttpStatus.Ok, header);
        rr.res.end(document.documentElement.outerHTML);
    }

}
