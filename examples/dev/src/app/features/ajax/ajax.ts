import {UserResponse} from '../../models/UserResponse';
import {Profile} from '../../shareds/Profile';
import {ProjectService} from '../../services/ProjectService';
import {Sim} from 'simple-boot-core/decorators/SimDecorator';
import {FrontModule} from 'simple-boot-front/module/FrontModule';
import {AjaxService} from 'simple-boot-front/service/AjaxService';
import {Intent} from 'simple-boot-core/intent/Intent';
import {ssrFetch} from '@fetch';

@Sim({scheme: 'ajax'})
export class Ajax extends FrontModule {
    public data: UserResponse | undefined;
    public profile: Profile | undefined;

    constructor(public projectService: ProjectService, public ajax: AjaxService) {
        super({name: __dirname, template: ssrFetch.text('./ajax.html', Ajax), styleImports: [ssrFetch.text('./ajax.css', Ajax)]});
    }

    onInit() {
        this.data = undefined;
        this.profile = new Profile();
        this.loadData();
    }

    sync() {
        if (this.profile && this.data) {
            this.profile.setUser(this.data.results[0]);
        }
    }

    goo(intent: Intent) {
        console.log('-->', intent)
    }

    loadData() {
        this.ajax
            .getJson<UserResponse>('https://randomuser.me/api/')
            .subscribe((it) => {
                this.data = it;
                if (this.profile && this.data.results && this.data.results.length > 0) {
                    this.profile.setUser(this.data.results[0]);
                }
            });
    }
}
