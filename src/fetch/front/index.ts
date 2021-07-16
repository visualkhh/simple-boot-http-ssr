import {Fetch} from '../Fetch';

class Index extends Fetch {
    constructor() {
        super();
        console.log('--SsrFrontFetch')
    }

    text(path: string, dirname?: string): Promise<string | void> {
        const headers = {
            accept: 'application/vnd.simple-boot-http-ssr'
        };
        const option = {method: 'GET', headers: headers};
        return fetch(location.pathname, option).then((response) => {
            // The API call was successful!
            return response.text();
        }).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
        });

        // return Promise.resolve(undefined);
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

const ssrFetch = new Index();
export {ssrFetch};
