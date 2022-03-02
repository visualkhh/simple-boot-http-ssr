import 'reflect-metadata';
import {IndexRouter} from '@server/app/index.router';
import {SimpleBootHttpSSRServer} from 'simple-boot-http-ssr/SimpleBootHttpSSRServer';
import {SSRFilter} from 'simple-boot-http-ssr/filters/SSRFilter';
import {MakeSimFrontOption} from '@src/bootfactory';
import {ConstructorType} from 'simple-boot-core/types/Types';
import {RequestResponse} from 'simple-boot-http-server/models/RequestResponse';
const using: ConstructorType<any>[] = [
];
new SSRFilter({
    frontDistPath: 'dist-front',
    factorySimFrontOption: (window: any) => MakeSimFrontOption(window),
    factory: Factory,
    poolOption: {
        max: 50,
        min: 1
    },
    using,
    domExcludes: []
}, otherInstanceSim)

const ssr = new SimpleBootHttpSSRServer(IndexRouter, option);
await ssr.run(otherInstanceSim);
return ssr;

console.log('server startUp finish!!', it.option.listen);
