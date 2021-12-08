import {IncomingMessage, ServerResponse} from 'http';

export interface Filter {
    before(req: IncomingMessage, res: ServerResponse): Promise<boolean>;
    after(req: IncomingMessage, res: ServerResponse): Promise<boolean>;
}
