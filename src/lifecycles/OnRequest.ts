import {RequestResponse} from '../models/RequestResponse';

export interface OnRequest<T extends RequestResponse> {
    onRequest(rr: T): void;
}