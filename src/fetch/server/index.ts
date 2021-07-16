import {Fetch} from '../Fetch';
import fs from 'fs';
import path from 'path';

class SrrFetch extends Fetch {
    constructor() {
        super();
        console.log('--SsrFetch')
    }

    async text(filePath: string, dirname?: string) {
        if (dirname) {
            return fs.promises.readFile(path.join(dirname, filePath), 'utf8');
        }
        return undefined;
    }

    // eslint-disable-next-line no-unused-vars
    actionText<T>(request?: any): Promise<void> {
        return Promise.resolve(undefined);
    }

    // eslint-disable-next-line no-unused-vars
    actionJson<T>(request?: any): Promise<void> {
        return Promise.resolve(undefined);
    }
}

const ssrFetch = new SrrFetch();
export {ssrFetch};
// export {Index as Fetch};
