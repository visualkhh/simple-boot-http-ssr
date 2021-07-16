import {FrontModule} from 'simple-boot-front/module/FrontModule';
import {Sim} from 'simple-boot-core/decorators/SimDecorator';
import {fetch} from '@fetch';
@Sim({scheme: 'layout'})
export class App extends FrontModule {
    constructor() {
        super({template: fetch.file('app.html'), styleImports: [fetch.file('app.css')]});
    }

    onInit() {
        super.onInit();
    }
}
