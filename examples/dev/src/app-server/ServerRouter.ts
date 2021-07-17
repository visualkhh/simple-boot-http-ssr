import {AppRouter} from '../app/AppRouter';
import {Sim} from 'simple-boot-core/decorators/SimDecorator';
import {ServerIndex} from './ServerIndex';

@Sim()
export class ServerRouter extends AppRouter {
    '/server' = ServerIndex
}
