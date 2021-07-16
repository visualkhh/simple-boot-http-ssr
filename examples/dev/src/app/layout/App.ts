import {FrontModule} from 'simple-boot-front/module/FrontModule';
import {Sim} from 'simple-boot-core/decorators/SimDecorator';
import {ssrFetch} from '@fetch';

@Sim({scheme: 'layout'})
export class App extends FrontModule {
    constructor() {
        super({
            template: ssrFetch.text('app.html', __dirname),
            styleImports: [ssrFetch.text('app.css', __dirname)]
        });
    }

    onInit() {
        super.onInit();
    }
}
