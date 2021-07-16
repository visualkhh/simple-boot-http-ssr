import {SimpleBootHttpSsr} from 'simple-boot-http-ssr/SimpleBootHttpSsr';
import {AppRouter} from './app/AppRouter';
import {HttpServerOption} from 'simple-boot-http-ssr/option/HttpServerOption';
import path from 'path';
import {frontConfig} from './frontConfig';
// import {fetch} from '@fetch'
// console.log('-->', SimpleBootHttpSsr)
// console.log('-->', AppRouter)
// console.log('-->', HttpServerOption)
const httpServerOption = new HttpServerOption();
httpServerOption.publicPath = path.join(__dirname, '..', 'public');
new SimpleBootHttpSsr(AppRouter, frontConfig, httpServerOption).run();
