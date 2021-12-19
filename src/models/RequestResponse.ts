import { IncomingMessage, ServerResponse } from 'http';
import jwt, { SignOptions } from 'jsonwebtoken';
import {HttpHeaders} from '../codes/HttpHeaders';
import {Mimes} from '../codes/Mimes';
// https://masteringjs.io/tutorials/node/http-request
//https://nodejs.org/ko/docs/guides/anatomy-of-an-http-transaction/
export class RequestResponse {
    constructor(public req: IncomingMessage, public res: ServerResponse) {
    }

    get reqUrl (): string {
        return this.req.url ?? '';
    }

    get reqUrlObj (): URL {
        return new URL('http://'+(this.reqHeaderFirst(HttpHeaders.Host) ?? 'localhost') + (this.req.url ?? ''));
    }

    get reqUrlSearchParams(): [string, string][] {
        return Array.from(this.reqUrlObj.searchParams as any);
    }

    get reqUrlSearchParamsObj (): {[p: string]: {[p: string]: any}} {
        const entries = this.reqUrlObj.searchParams;
        return Object.fromEntries(entries as any)
    }

    reqHasAcceptHeader(accept: Mimes | string): boolean {
        return (this.reqHeaderFirst(HttpHeaders.Accept)??'').indexOf(accept) > -1;
    }

    reqBodyJsonData() {
        return new Promise((resolve, reject) => {
            let data = '';
            this.req.on('data', (chunk) => data += chunk);
            this.req.on('error', err => reject(err));
            this.req.on('end', () => resolve(JSON.parse(data)));
        });
    }

    resBodyJsonData() {
        new Promise((resolve, reject) => {
            let data = '';
            this.res.on('data', chunk => data += chunk);
            this.res.on('error', err => reject(err));
            this.res.on('end', () => resolve(JSON.parse(data)));
        });
    }

    reqMethod() {
        return this.req.method?.toUpperCase();
    }

    reqHeader(key: HttpHeaders | string, defaultValue?: string) {
        return this.req.headers[key.toLowerCase()] ?? defaultValue;
    }

    reqHeaderFirst(key: HttpHeaders | string, defaultValue?: string) {
        const header = this.req.headers[key.toLowerCase()];
        if (header && Array.isArray(header)) {
            return header[0] ?? defaultValue;
        } else {
            return header ?? defaultValue;
        }
    }

    reqAuthorizationHeader() {
        return this.reqHeaderFirst(HttpHeaders.Authorization);
    }
    reqRefreshTokenHeader() {
        return this.reqHeaderFirst(HttpHeaders.Authorization);
    }

    get resStatusCode() {
        return this.res.statusCode;
    }

    resHeaderFirst(key: HttpHeaders | string, defaultValue?: string) {
        const header = this.res.getHeader(key.toLowerCase());
        if (header && Array.isArray(header)) {
            return header[0] ?? defaultValue;
        } else {
            return header ?? defaultValue;
        }
    }

    reqSession(): { [key: string]: any} {
        if ((this.req as any).simpleboot_session === undefined) {
            (this.req as any).simpleboot_session = {};
        }
        return (this.req as any).simpleboot_session;
    }

    reqSessionSet(key: string, value: any): void {
        (this.reqSession as any)[key] = value;
    }

    reqSessionGet<T = any>(key: string): T | undefined {
        const session = this.reqSession as any;
        if (session) {
            return session[key] as T;
        }
    }
    // res.on("readable", () => {
    //     console.log('readable???')
    // });
    // res.on('complete', function (details) {
    //     var size = details.req.bytes;
    //     console.log('complete-->', size)
    // });
    // res.on('finish', function() {
    //     console.log('finish??');
    // });
    // res.on('end', () => {
    //     console.log('end--?')
    // });

}
