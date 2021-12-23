import { Filter } from './Filter';
import {IncomingMessage, ServerResponse} from 'http';

export class ThrowFilter implements Filter {

    constructor(private error: any) {
    }

    async before(req: IncomingMessage, res: ServerResponse) {
        throw this.error;
        return false;
    }

    async after(req: IncomingMessage, res: ServerResponse) {
        return true;
    }
}