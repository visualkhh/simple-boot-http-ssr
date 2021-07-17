import {SimpleBootHttpSsr} from 'simple-boot-http-ssr/SimpleBootHttpSsr';
import {HttpServerOption} from 'simple-boot-http-ssr/option/HttpServerOption';
import path from 'path';
import {frontConfig} from './frontConfig';
import {ServerRouter} from './app-server/ServerRouter';
const httpServerOption = new HttpServerOption();
httpServerOption.publicPath = path.join(__dirname, '..', 'public');
new SimpleBootHttpSsr(ServerRouter, frontConfig, httpServerOption).run();
