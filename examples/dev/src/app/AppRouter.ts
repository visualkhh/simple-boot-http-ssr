import {Sim} from 'simple-boot-core/decorators/SimDecorator';
import {FrontRouter} from 'simple-boot-front/router/FrontRouter';
import {App} from './layout/App';
import {Index} from './features/index/Index';
import {User} from './features/user/User';

@Sim()
export class AppRouter extends FrontRouter {
    '' = Index
    '/' = Index
    '/user' = User

    constructor() {
        super('', App);
    }
}
