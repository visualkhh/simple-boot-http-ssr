import {Sim} from 'simple-boot-core/decorators/SimDecorator';
import {FrontRouter} from 'simple-boot-front/router/FrontRouter';
import {App} from './layout/App';
import {Index} from './features/index/Index';
import {Ajax} from './features/ajax/ajax';

@Sim()
export class AppRouter extends FrontRouter {
    '' = Index
    '/' = Index
    '/ajax' = Ajax

    constructor() {
        super('', App);
    }
}
