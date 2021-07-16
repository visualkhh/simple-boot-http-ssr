import {FrontModule} from 'simple-boot-front/module/FrontModule';
import {Sim} from 'simple-boot-core/decorators/SimDecorator';
import {ssrFetch} from '@fetch';

@Sim({scheme: 'layout'})
export class App extends FrontModule {
    constructor() {
        super({
            name: __dirname,
            template: ssrFetch.text('app.html', App),
            styleImports: [ssrFetch.text('app.css', App)]
        });
    }

    onInit() {
        super.onInit();
    }
}
