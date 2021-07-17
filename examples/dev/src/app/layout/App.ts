import {FrontModule} from 'simple-boot-front/module/FrontModule';
import {Sim} from 'simple-boot-core/decorators/SimDecorator';
import {ssrFetch} from '@fetch';

@Sim({scheme: 'layout'})
export class App extends FrontModule {
    constructor() {
        super({
            name: __dirname,
            template: 'fetch://app.html',
            styleImports: ['fetch://app.css'],
            fetcher: ssrFetch
        });
    }

    onInit() {
        super.onInit();
    }
}
