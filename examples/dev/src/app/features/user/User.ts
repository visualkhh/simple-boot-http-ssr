import {Sim} from 'simple-boot-core/decorators/SimDecorator';
import {FrontModule} from 'simple-boot-front/module/FrontModule';
import {ssrFetch} from '@fetch';

@Sim()
export class User extends FrontModule {
    constructor() {
        super({name: __dirname, template: 'fetch://./user.html', styleImports: ['h1{color:blue}'], fetcher: ssrFetch});
    }

    public goServer() {
        console.log('goServer')
        ssrFetch.json('/server', {name: 'visualkhh 빵꾸똥꾸'})
    }
}
