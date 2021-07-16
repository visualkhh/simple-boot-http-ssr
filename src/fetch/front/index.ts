import {Fetch} from '../Fetch';

class Index extends Fetch {
    constructor() {
        super();
        console.log('--SsrFrontFetch')
    }

    file(path: string): Promise<string | undefined> {
        return Promise.resolve(undefined);
    }

    // eslint-disable-next-line no-unused-vars
    action<T>(request?: any): Promise<undefined> {
        return Promise.resolve(undefined);
    }
}
const fetch = new Index();
export {fetch};
