export function useApiPath(path: string) {
    let url = import.meta.env.VITE_API_URL + path
    let search = window.location.search.substr(1)
    if (search)
        search = '&' + search
    let params = '?' + new URLSearchParams({ "auth": localStorage.getItem('auth') || "" }) + search
    return url + params
}

export default function Api(path: string) {
    async function doRequest(path: string) {
        let res = {};

        if (path.substr(0, 1) !== '/')
            path = '/' + path

        let url = import.meta.env.VITE_API_URL + path

        if (url.substr(-1) === '/')
            url = url.substr(0, -1)

        let search = window.location.search.substr(1)
        if (search)
            search = '&' + search

        let params = (path.match(/\?/g)?'&':'?') + new URLSearchParams({ "auth": localStorage.getItem('auth') || "" }) + search

        let data = await fetch(url + params, { redirect: 'follow' });
        if (data?.status == 200) {
            res = await data.json();

        }

        if (data?.status == 403) {
            return Promise.reject(new Error("" + data?.status));
        }

        window.scrollTo(0, 0);
        return res;
    }

    return doRequest(path)
}