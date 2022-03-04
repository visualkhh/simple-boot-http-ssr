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
