import {Fetch} from "../Fetch";

class SrrFetch extends Fetch {
    constructor() {
        super();
        console.log('--SsrFetch')
    }

    file(path: string): Promise<string | undefined> {
        return Promise.resolve(undefined);
    }

    // eslint-disable-next-line no-unused-vars
    action<T>(request?: any): Promise<undefined> {
        return Promise.resolve(undefined);
    }
}

const fetch = new SrrFetch();
export {fetch};
// export {Index as Fetch};
