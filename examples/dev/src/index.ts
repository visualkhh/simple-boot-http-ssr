// import {SimpleBootHttpServer} from 'simple-boot-http-ssr/SimpleBootHttpServer';
// import {HttpServerOption} from 'simple-boot-http-ssr/option/HttpServerOption';
// import {AppRouter} from './app/AppRouter';
// import {SimpleBootHttpServer as a} from '@server'
// new SimpleBootHttpServer(AppRouter, new HttpServerOption()).run();
// console.log('-->', a)

// import {Fetch} from '@fetch'
// console.log('-ddfffffzz22222zzzzzzzz54ffssss->', Fetch)

import {SimFrontOption, UrlType} from 'simple-boot-front/option/SimFrontOption';
import {SimpleBootFront} from 'simple-boot-front/SimpleBootFront';
import {AppRouter} from './app/AppRouter';

const option = new SimFrontOption([]).setUrlType(UrlType.path);
const simpleApplication = new SimpleBootFront(AppRouter, option);
simpleApplication.run();
