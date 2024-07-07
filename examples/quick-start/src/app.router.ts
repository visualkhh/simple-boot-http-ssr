import {Sim} from 'simple-boot-core/decorators/SimDecorator';
import {Router} from 'simple-boot-core/decorators/route/Router';
import {Component} from 'simple-boot-front/decorators/Component';
import template from './app.router.html';
import {MainPage} from '@src/pages/main.page';
import {SubPage} from '@src/pages/sub.page';
import {RouterAction} from 'simple-boot-core/route/RouterAction';
import {Intent} from 'simple-boot-core/intent/Intent';
@Sim
@Router({
    path: '',
    route: {
        '/': MainPage,
        '/sub': SubPage,
    }
})
@Component({
    template: template
})
export class AppRouter implements RouterAction {
    private child: any;
    async canActivate(url: Intent, module: any) {
        this.child = module;
    }

    hasActivate(checkObj: any): boolean {
        return this.child === checkObj;
    }
}