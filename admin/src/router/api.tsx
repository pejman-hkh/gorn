export default function Api(path: string) {
    async function doRequest(path: string) {

        let res = {};
        try {
            if (path.substr(0, 1) !== '/')
                path = '/' + path
            console.log(import.meta.env)
            let url = import.meta.env.VITE_API_URL + path

            if (url.substr(-1) !== '/')
                url += '/'
            let search = window.location.search.substr(1)
            if (search)
                search = '&' + search

            let params = '?' + new URLSearchParams({ "auth": localStorage.getItem('auth')||"" }) + search

            let data = await fetch(url + params);
            res = await data.json();
        } catch (e) {

        }

        window.scrollTo(0, 0);
        return res;
    }
    return doRequest(path)
}