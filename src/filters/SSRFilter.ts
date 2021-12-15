import { Filter } from '../filters/Filter';
import { Mimes } from '../codes/Mimes';
import { Navigation } from 'simple-boot-front/service/Navigation';
import {IncomingMessage, ServerResponse} from 'http';
import {RequestResponse} from '../models/RequestResponse';
import {SimpleBootFront} from 'simple-boot-front/SimpleBootFront';
import {HttpStatus} from '../codes/HttpStatus';
import {HttpHeaders} from '../codes/HttpHeaders';

export class SSRFilter implements Filter {
    private navigation: Navigation;

    constructor(private simpleBootFront: SimpleBootFront) {
        this.navigation = simpleBootFront.getSimstanceManager().getOrNewSim(Navigation)!
    }

    async before(req: IncomingMessage, res: ServerResponse) {
        const rr = new RequestResponse(req, res)
        const url = rr.reqUrl ?? '';
        // if ((rr.req.headers.accept ?? Mimes.TextHtml).indexOf(Mimes.TextHtml) >= 0) {
        if (rr.reqHasAcceptHeader(Mimes.TextHtml)) {
            this.navigation.go(url);
            const header = {} as any;
            header[HttpHeaders.ContentType] = Mimes.TextHtml;
            rr.res.writeHead(HttpStatus.Ok, header);
            rr.res.end(document.documentElement.outerHTML);
            return false;
        } else {
            return true;
        }
    }

    async after(req: IncomingMessage, res: ServerResponse) {
        return true;
    }

}
