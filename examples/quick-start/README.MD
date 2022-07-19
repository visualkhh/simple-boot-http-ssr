QUICK START
===
## front
```typescript
import {UserService} from '../../src/services/UserService'
import {Sim} from 'simple-boot-core/decorators/SimDecorator';
@Sim({
    scheme: UserService.scheme
})
export class UserFrontService implements UserService.UserService {
    say(prefix: string): void {
        console.log(prefix, '--> frontend-side');
    }
}


const using: ConstructorType<any>[] = [
    UserFrontService // 💥 Important! Object type to use on the front
];
Factory.create(MakeSimFrontOption(window), using).then(it => {
    it.run()
});

```


## server
```typescript
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
const using: ConstructorType<any>[] = [
    UserServerService // 💥 Important! Object type to use on the server
];

const otherInstanceSim = new Map<ConstructorType<any>, any>();
const option = new HttpServerOption();
const frontDistPath = 'dist-front';
option.filters = [
    new ResourceFilter(frontDistPath,
        ['\\.js$', '\\.map$', '\\.ico$', '\\.png$', '\\.jpg$', '\\.jpeg$', '\\.gif$', 'offline\\.html$', 'webmanifest$', 'manifest\\.json', 'service-worker\\.js$', 'googlebe4b1abe81ab7cf3\\.html$']
    ),
    new SSRFilter({
        frontDistPath: frontDistPath,
        factorySimFrontOption: (window: any) => MakeSimFrontOption(window),
        factory: Factory,
        poolOption: {
            max: 10,
            min: 1
        },
        using,
        domExcludes: []
    }, otherInstanceSim)
];
option.listen.listeningListener = (server: SimpleBootHttpSSRServer) => {
    console.log(`startup server ${server.option.listen.port}`);
}
new SimpleBootHttpSSRServer(AppRouter, option).run(otherInstanceSim);
```

## common (src/...)
```typescript
export namespace UserService {
    export const scheme = 'UserService';
    export interface UserService {
        say: (prefix: string) => void;
    }
}
```
## using (src/...)
```typescript
@Sim()
@Component({
    template: '<h1>MainPage</h1>'
})
export class MainPage {
    constructor(@Inject({scheme: UserService.scheme}) private userService: UserService.UserService) {
        console.log('main constructor');
        this.userService.say('main');
    }
}

@Sim()
@Component({
    template: '<h1>SubPage</h1>'
})
export class SubPage {
    constructor(@Inject({scheme: UserService.scheme}) private userService: UserService.UserService) {
        console.log('main constructor');
        this.userService.say('sub');
    }
}
```
result (console)
- GET http://localhost:8081
  - server: main --> server-side
  - front: main --> front-side
- GET http://localhost:8081/sub
  - server: sub --> server-side
  - front: sub --> front-side


