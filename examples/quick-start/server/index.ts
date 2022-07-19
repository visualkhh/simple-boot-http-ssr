import 'reflect-metadata';
import {SSRFilter} from 'simple-boot-http-ssr/filters/SSRFilter';
import Factory, {MakeSimFrontOption} from '@src/bootfactory';
import {ConstructorType} from 'simple-boot-core/types/Types';
import {HttpServerOption} from 'simple-boot-http-server/option/HttpServerOption';
import {SimpleBootHttpSSRServer} from 'simple-boot-http-ssr';
import {AppRouter} from '@src/app.router';
import {ResourceFilter} from 'simple-boot-http-server/filters/ResourceFilter';
import {UserServerService} from '@server/services/UserServerService';

const using: ConstructorType<any>[] = [
    UserServerService
];

const otherInstanceSim = new Map<ConstructorType<any>, any>();
const option = new HttpServerOption();
const frontDistPath = 'dist-front';
option.filters = [
    new ResourceFilter(frontDistPath,
        ['\\.js$', '\\.map$', '\\.ico$', '\\.png$', '\\.jpg$', '\\.jpeg$', '\\.gif$', 'offline\\.html$', 'webmanifest$', 'manifest\\.json', 'service-worker\\.js$', 'googlebe4b1abe81ab7cf3\\.html$']
    ),
    new SSRFilter({
        frontDistPath: frontDistPath,
        factorySimFrontOption: (window: any) => MakeSimFrontOption(window),
        factory: Factory,
        poolOption: {
            max: 10,
            min: 1
        },
        using,
        domExcludes: []
    }, otherInstanceSim)
];
option.listen.listeningListener = (server: SimpleBootHttpSSRServer) => {
    console.log(`startup server ${server.option.listen.port}`);
}
new SimpleBootHttpSSRServer(AppRouter, option).run(otherInstanceSim);

// const ssr = new SimpleBootHttpSSRServer(IndexRouter, option);
// await ssr.run(otherInstanceSim);
// return ssr;
//
// console.log('server startUp finish!!', it.option.listen);
