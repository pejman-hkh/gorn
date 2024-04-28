export function useApiPath(path: string) {
    let url = import.meta.env.VITE_API_URL + path
    let search = window.location.search.substr(1)
    if (search)
        search = '&' + search
    let params = '?' + new URLSearchParams({ "auth": localStorage.getItem('auth') || "" }) + search
    return url + params
}

export default function Api(path: string) {
    const lang: string = localStorage.getItem("lang")||""
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

        let params = (path.match(/\?/g) ? '&' : '?') + new URLSearchParams({ "auth": localStorage.getItem('auth') || "", "lang": lang }) + search
        let data
        try {
            data = await fetch(url + params, { redirect: 'follow' });
        } catch (e) {
            //return Promise.reject(new Error("Api down"));
        }

        if (data?.status == 200) {
            res = await data.json();
        }

        if (data?.status == 403) {
            return Promise.resolve({"status": 403});
        }

        window.scrollTo(0, 0);
        return res;
    }

    return doRequest(path)
}