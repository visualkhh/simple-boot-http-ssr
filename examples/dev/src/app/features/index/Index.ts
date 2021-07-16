import {Sim} from 'simple-boot-core/decorators/SimDecorator';
import {FrontModule} from 'simple-boot-front/module/FrontModule';
import html from './index.html';

@Sim()
export class Index extends FrontModule {
    constructor() {
        super({template: html});
    }
}
