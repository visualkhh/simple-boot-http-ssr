import {Sim} from 'simple-boot-core/decorators/SimDecorator';
import {Router} from 'simple-boot-core/decorators/route/Router';
import {Component} from 'simple-boot-front/decorators/Component';
import template from './app.router.html';
@Sim()
@Router({
    path: ''
})
@Component({
    template: template
})
export class AppRouter {

}