import { useEffect, useRef, useState } from "react";
import { DataContext } from "./data";
import Api from "./api";

function RouteTo(Layout: any, Component: any) {
  return <Layout><Component /></Layout>
}

export function useGoTo(to: string) {
  history.pushState({}, "", to);
}

export function useRouterUpdateDataContext() {
  window.dispatchEvent(new Event('updatedatacontext'));
}

function getPathName() {
  let pathName = window.location.pathname

  if (pathName.substr(-1) != '/')
    pathName += '/'
  return pathName
}
export default function useRouter(baseUri: string, routes: any, props: any) {
  const ref = useRef(false);

  const [data, setData] = useState(props.data)

  const value = [data, setData, {baseUri : baseUri}];

  const [path, setPath] = useState(getPathName())

  useEffect(() => {

    if (!ref.current) {

      history.pushState = ((f: any) => function pushState(this: any, ...args) {
        var ret = f.apply(this, [...args]);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
      })(history.pushState);

      history.replaceState = ((f: any) => function replaceState(this: any, ...args) {
        var ret = f.apply(this, [...args]);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
      })(history.replaceState);

      window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'))
      });


      window.addEventListener("updatedatacontext", () => {
        Api(window.location.pathname).then(function (fetchData) {
          setData(fetchData)
        })
      })

      window.addEventListener("locationchange", () => {
        Api(window.location.pathname).then(function (fetchData) {
          setData(fetchData)
          setPath(getPathName())
        })
      })
      ref.current = true;
    }
  }, [])

  let content
  let routeFound = false
  for (let route in routes) {
    let val = routes[route]

    if (route.substr(-1) != '/')
      route += '/'

    if (path == baseUri+route) {
      content = RouteTo(val[0], val[1])
      routeFound = true
      break
    }

  }
  if (!routeFound && routes["*"]) {
    let val = routes["*"]
    content = RouteTo(val[0], val[1])
  }

  return <DataContext.Provider value={value}>{content}</DataContext.Provider>
}