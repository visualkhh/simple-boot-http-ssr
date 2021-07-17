import {Fetcher} from 'simple-boot-front/fetch/Fetcher';
import fs from 'fs';
import path from 'path';
class SrrFetch extends Fetcher {
    constructor() {
        super();
        console.log('--SsrFetch')
    }

    async text(filePath: string, param = {}, dname = '') {
        return await fs.promises.readFile(path.join(dname, filePath), 'utf8');
    }

    // eslint-disable-next-line no-unused-vars
    async json<T>(url: string, param = {}) {
        console.log('server fetch url-->', url, 'param', param)
        return undefined;
    }
}

const ssrFetch = new SrrFetch();
export {ssrFetch};
// export {Index as Fetch};
