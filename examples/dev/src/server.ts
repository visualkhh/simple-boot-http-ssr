import {SimpleBootHttpSsr} from 'simple-boot-http-ssr/SimpleBootHttpSsr';
import {AppRouter} from './app/AppRouter';
import {HttpServerOption} from 'simple-boot-http-ssr/option/HttpServerOption';

console.log('-->', SimpleBootHttpSsr)
console.log('-->', AppRouter)
console.log('-->', HttpServerOption)
// new SimpleBootHttpSsr(AppRouter, new HttpServerOption()).run();
console.log('------')
