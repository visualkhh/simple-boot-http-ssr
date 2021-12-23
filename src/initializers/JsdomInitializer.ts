import * as JSDOM from 'jsdom';
import fs from 'fs';
import path from 'path';
// import { ErrorBase } from '@server/errors/ErrorBase';
import {Initializer} from './Initializer';
import {ReconfigureSettings} from 'jsdom';

export class JsdomInitializer implements Initializer<JSDOM.JSDOM> {

    constructor(private frontDistPath: string, private reconfigureSettings?:ReconfigureSettings) {
    }

    async run() {
        const indexHTML = fs.readFileSync(path.join(this.frontDistPath, 'index.html'), 'utf8');
        const jsdom = new JSDOM.JSDOM(indexHTML);
        if (this.reconfigureSettings){
            jsdom.reconfigure(this.reconfigureSettings);
        }
        // global setting
        global.document = jsdom.window.document;
        global.window = jsdom.window as unknown as Window & typeof globalThis;
        const dummyResponse = {ok: false, json: () => Promise.resolve({})}; // as Response;
        global.fetch = (...data: any): Promise<any> => Promise.resolve(dummyResponse);
        global.history = jsdom.window.history;
        global.Event = jsdom.window.Event;
        // @ts-ignore
        // global.Error = ErrorBase;
        global.navigator = jsdom.window.navigator;
        global.NodeFilter = jsdom.window.NodeFilter;
        global.Node = jsdom.window.Node;
        global.HTMLElement = jsdom.window.HTMLElement;
        global.Element = jsdom.window.Element;
        return jsdom;
    }
}
//
// export default new JsdomInitializer();
