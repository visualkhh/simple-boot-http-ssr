import {Sim} from 'simple-boot-core/decorators/SimDecorator';
import {Component} from 'simple-boot-front/decorators/Component';
import {Inject} from 'simple-boot-core/decorators/inject/Inject';
import {UserService} from '@src/services/UserService';

@Sim()
@Component({
    template: '<h1>SubPage</h1>'
})
export class SubPage {
    constructor(@Inject({scheme: UserService.scheme}) private userService: UserService.UserService) {
        console.log('main constructor');
        this.userService.say('sub');
    }
}