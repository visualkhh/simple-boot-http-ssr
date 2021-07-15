import {SimpleBootHttpServer} from 'simple-boot-http-ssr/SimpleBootHttpServer';
import {HttpServerOption} from 'simple-boot-http-ssr/option/HttpServerOption';
import {AppRouter} from './app/AppRouter';

new SimpleBootHttpServer(AppRouter, new HttpServerOption()).run();
