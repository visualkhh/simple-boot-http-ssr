SIMPLE-BOOT-HTTP-SRC
===
## Examples 🚀 Quick start

--- 

### STEP 1
```shell
git submodule init
git submodule update

cd libs/dom-render
git checkout master
npm run npm-build

cd libs/simple-boot-core
git checkout master
npm run npm-build


cd libs/simple-boot-front
git checkout master
npm run npm-build

cd libs/simple-boot-http-server
git checkout master
npm run npm-build

#💥 cd root directory
npm install
npm run npm-build
```


### STEP 2
```shell
cd examples/{examples-name}
npm install
npm start
```