// import {JsdomInitializer} from '../initializers/JsdomInitializer';
// import {RandomUtils} from 'simple-boot-core/utils/random/RandomUtils';
// import {threadId, parentPort, workerData, isMainThread} from "worker_threads";
// import {FactoryAndParams, SSRFilter} from './SSRFilter';
//
//
// export const TargetSSR: {filter?: SSRFilter} = {
//     filter: undefined
// };
// console.log('--------->', TargetSSR, isMainThread)
//
// if (!isMainThread) {
//     parentPort?.postMessage('----qqq---------');
// }
//
//
// if (!isMainThread) {
//     parentPort?.on('message', async (config: any) => {
//         console.log('---', config)
//         const name = RandomUtils.uuid();
//         const jsdom = await new JsdomInitializer(config.frontDistPath, config.frontDistIndexFileName || 'index.html', {url: 'http://localhost'}).run();
//         parentPort?.postMessage(jsdom);
//         parentPort?.close();
//         // const window = jsdom.window as unknown as Window & typeof globalThis;
//         // (window as any).ssrUse = false;
//         // const option = config.factorySimFrontOption(window);
//         // option.name = name;
//         // const simpleBootFront = await config.factory.create(option, config.using, config.domExcludes);
//         // simpleBootFront.run(config.otherInstanceSim);
//         // (simpleBootFront as any).jsdom = jsdom;
//         // parentPort?.postMessage(simpleBootFront);
//         // parentPort?.close();
//     })
//     // for (let i = 0; i < 10; i++) {
//     //     parentPort?.postMessage(getRandomNumber())
//     // }
//
// }
// // parentPort?.on('message', async (ssrFilter: SSRFilter) => {
// //     console.log('threadID: ' + threadId);
// //     console.log('parent message: ');
// //
// //
// //     const name = RandomUtils.uuid();
// //     const jsdom = await new JsdomInitializer(ssrFilter.factory.frontDistPath, ssrFilter.factory.frontDistIndexFileName || 'index.html', {url: 'http://localhost'}).run();
// //     const window = jsdom.window as unknown as Window & typeof globalThis;
// //     (window as any).ssrUse = false;
// //     const option = ssrFilter.factory.factorySimFrontOption(window);
// //     option.name = name;
// //     const simpleBootFront = await ssrFilter.factory.factory.create(option, ssrFilter.factory.using, ssrFilter.factory.domExcludes);
// //     simpleBootFront.run(ssrFilter.otherInstanceSim);
// //     (simpleBootFront as any).jsdom = jsdom;
// //     parentPort?.postMessage(simpleBootFront);
// //     parentPort?.close();
// // });
import {ConstructorType} from 'simple-boot-core/types/Types';
import {FactoryAndParams} from './SSRFilter';
import {JsdomInitializer} from '../initializers/JsdomInitializer';
import JSDOM from 'jsdom';
import {RandomUtils} from 'simple-boot-core/utils/random/RandomUtils';
import {SimpleBootFront} from 'simple-boot-front/SimpleBootFront';

export class SSRWorker {
    public welcomUrl = 'http://localhost'
    private simpleBootFront?: SimpleBootFront;

    constructor(public factory: FactoryAndParams, public otherInstanceSim?: Map<ConstructorType<any>, any>) {

    }

    async run() {
        this.simpleBootFront = await this.makeFront();
    }

    async makeJsdom() {
        const jsdom = await new JsdomInitializer(this.factory.frontDistPath, this.factory.frontDistIndexFileName || 'index.html', {url: this.welcomUrl}).run();
        return jsdom;
    }

    async makeFront(jsdom?: JSDOM.JSDOM) {
        if (!jsdom) {
            jsdom = await this.makeJsdom();
        }
        const name = RandomUtils.uuid();
        // const jsdom = await this.makeJsdom();
        const window = jsdom.window as unknown as Window & typeof globalThis;
        (window as any).ssrUse = false;
        const option = this.factory.factorySimFrontOption(window);
        option.name = name;
        const simpleBootFront = await this.factory.factory.create(option, this.factory.using, this.factory.domExcludes);
        simpleBootFront.run(this.otherInstanceSim);
        (simpleBootFront as any).jsdom = jsdom;
        return simpleBootFront;
    }


    async getHtml(url: string) {
        if (this.simpleBootFront && (this.simpleBootFront.option.window as any).ssrUse) {

        } else if (this.simpleBootFront) {
            (this.simpleBootFront.option.window as any).ssrUse = true;
            delete (this.simpleBootFront.option.window as any).server_side_data;

            // runRouting!!
            await this.simpleBootFront.goRouting(url);
            let html = this.simpleBootFront.option.window.document.documentElement.outerHTML;

            const serverSideData = (this.simpleBootFront.option.window as any).server_side_data;
            if (serverSideData) {
                const data = Object.entries(serverSideData).map(([k, v]) => {
                    if (typeof v === 'string') {
                        return `window.server_side_data.${k} = ${v}`;
                    } else {
                        return `window.server_side_data.${k} = ${JSON.stringify(v)}`;
                    }
                }).join(';');
                if (data) {
                    html = html.replace('</head>', `<script> window.server_side_data={}; ${data}; </script></head>`);
                }
            }

            this.makeFront().then(it => {
                this.simpleBootFront = it;
            });
            return html;
        } {

        }

    }
}