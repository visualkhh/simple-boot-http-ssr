import {Fetcher} from 'simple-boot-front/fetch/Fetcher';

class FrontFetch extends Fetcher {
    constructor() {
        super();
        console.log('--SsrFrontFetch')
    }

    async text(path: string, param = {}) {
        // const headers = {
        //     accept: 'application/vnd.simple-boot-http-ssr'
        // };
        const url = location.pathname + '?' + new URLSearchParams(Object.assign(param, {path: path, simpleboothttpssr: 'true'}));
        const option = {method: 'GET'};
        return (await fetch(url, option).then((response) => {
            // The API call was successful!
            return response.text();
        }).catch(function (err) {
            console.warn('Something went wrong.', err);
        }));
    }

    // eslint-disable-next-line no-unused-vars
    async json<T>(url: string, param = {}) {
        const headers = {
            'Content-Type': 'application/json'
        };
        url = url + '?' + new URLSearchParams({simpleboothttpssr: 'true'});
        const option = {method: 'POST', headers, body: JSON.stringify(param)};
        return (await fetch(url, option).then((response) => {
            return response.json();
        }).catch(function (err) {
            console.warn('Something went wrong.', err);
        }));
    }
}

const ssrFetch = new FrontFetch();
export {ssrFetch};
