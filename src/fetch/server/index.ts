import {Fetcher} from 'simple-boot-front/fetch/Fetcher';

class SrrFetch extends Fetcher {
    constructor() {
        super();
        console.log('--SsrFetch')
    }

    async text(filePath: string, param = {}) {
        return undefined;
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
