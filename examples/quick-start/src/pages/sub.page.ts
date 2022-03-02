import {Sim} from 'simple-boot-core/decorators/SimDecorator';
import {Component} from 'simple-boot-front/decorators/Component';

@Sim()
@Component({
    template: '<h1>SubPage</h1>'
})
export class SubPage {

}