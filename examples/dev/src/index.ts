import {SimpleBootFront} from 'simple-boot-front/SimpleBootFront';
import {AppRouter} from './app/AppRouter';
import {frontConfig} from './frontConfig';
const simpleApplication = new SimpleBootFront(AppRouter, frontConfig);
simpleApplication.run();
