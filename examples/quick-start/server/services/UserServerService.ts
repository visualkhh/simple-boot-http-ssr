import {UserService} from '../../src/services/UserService'
import {Sim} from 'simple-boot-core/decorators/SimDecorator';
@Sim({
    scheme: UserService.scheme
})
export class UserServerService implements UserService.UserService {
    say(prefix: string): void {
        console.log(prefix, '--> server-side');
    }
}