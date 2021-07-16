import {Sim} from 'simple-boot-core/decorators/SimDecorator';
import {FrontModule} from 'simple-boot-front/module/FrontModule';
import {ssrFetch} from '@fetch';

@Sim()
export class Index extends FrontModule {
    constructor() {
        super({template: ssrFetch.text('./index.html', __dirname)});
    }
}
