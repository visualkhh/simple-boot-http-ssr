SIMPLE-BOOT-HTTP-SERVER
===

### package.json
```json
{
  "scripts": {
    "watch": "nodemon -e ts -w ./src -w ../../src --exec 'ts-node --project tsconfig-ssr.json -r tsconfig-paths/register src/server.ts'",
    "watch:test": "nodemon --watch 'src/*.ts' --ignore 'src/**/*.spec.ts' --exec 'echo 11'",
    "start": "ts-node --project tsconfig-ssr.json -r tsconfig-paths/register src/server.ts",
    "build": "tsc src/server.ts",
    "build:server": "parcel build src/server.ts --target node",
    "build:tt": "rm -rf build && parcel build src/index.ts --out-dir build --no-source-maps",
    "build:parcel": "rm -rf ./public && parcel build src/index.html --out-dir ./public",
    "watch:parcel": "rm -rf ./public && parcel watch src/index.html --out-dir ./public",
    "start:parcel": "rm -rf ./public && parcel --port 3000 src/index.html ./public",
    "dev": "ts-node-dev --respawn  --project tsconfig-ssr.json -r tsconfig-paths/register src/index.ts",
    "build:prod": "cross-env NODE_ENV=production parcel build src/index.html --public-url .",
    "test": "jest --detectOpenHandles --forceExit"
  }
}
```


# server
### server.ts
```typescript
import {SimpleBootHttpSsr} from 'simple-boot-http-ssr/SimpleBootHttpSsr';
import {HttpServerOption} from 'simple-boot-http-ssr/option/HttpServerOption';
import path from 'path';
import {frontConfig} from './frontConfig';
import {ServerRouter} from './app-server/ServerRouter';
const httpServerOption = new HttpServerOption();
httpServerOption.publicPath = path.join(__dirname, '..', 'public');
new SimpleBootHttpSsr(ServerRouter, frontConfig, httpServerOption).run();
```
### tsconfig-ssr.json
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "paths": {
      "@fetch": ["../../src/fetch/server"]
    }
  }
}

```


# front
### index.ts (front)
```typescript
import {SimpleBootFront} from 'simple-boot-front/SimpleBootFront';
import {AppRouter} from './app/AppRouter';
import {frontConfig} from './frontConfig';
const simpleApplication = new SimpleBootFront(AppRouter, frontConfig);
simpleApplication.run();
```
### tsconfig.json
```json
{
  "paths": {
    "@fetch": ["../../src/fetch/front"]
  }
}
```


### one source (server, front)
```typescript
@Sim()
export class Index extends FrontModule {
    constructor() {
        super({name: __dirname, template: 'fetch://./index.html', styleImports: ['h1{color:red}'], fetcher: ssrFetch});
    }

    public goServer() {
        console.log('goServer')
        ssrFetch.json('/server', {name: 'visualkhh 빵꾸똥꾸'})
    }
}
```
