import {Sim} from 'simple-boot-core/decorators/SimDecorator';
import {Component} from 'simple-boot-front/decorators/Component';

@Sim()
@Component({
    template: '<h1>MainPage</h1>'
})
export class MainPage {

}