import * as JSDOM from 'jsdom';
import fs from 'fs';
import path from 'path';

import {ReconfigureSettings} from 'jsdom';

export class JsdomInitializer {
    constructor(private frontDistPath: string, private frontDistIndexFileName: string, private reconfigureSettings?:ReconfigureSettings) {
    }

    public static loadFile(distPath: string, filePath: string): string {
        return fs.readFileSync(path.join(distPath, filePath), 'utf8');
    }

    async run(): Promise<JSDOM.JSDOM> {
        // const indexHTML = fs.readFileSync(path.join(this.frontDistPath, 'index.html'), 'utf8');
        // const indexHTML = JsdomInitializer.loadFile(this.frontDistPath, this.frontDistIndexFileName);
        const pathStr = path.join(this.frontDistPath, this.frontDistIndexFileName);
        const jsdom = await JSDOM.JSDOM.fromFile(pathStr);
        if (this.reconfigureSettings) {
            jsdom.reconfigure(this.reconfigureSettings);
        }
        // global setting
        global.document = jsdom.window.document;
        global.window = jsdom.window as unknown as Window & typeof globalThis;
        const dummyResponse = {ok: false, json: () => Promise.resolve({})}; // as Response;
        global.fetch = (...data: any): Promise<any> => Promise.resolve(dummyResponse);
        global.history = jsdom.window.history;
        global.Event = jsdom.window.Event;
        global.IntersectionObserver = jsdom.window.IntersectionObserver;
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
