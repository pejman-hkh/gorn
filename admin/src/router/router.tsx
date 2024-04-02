import { useEffect, useRef, useState } from "react";
import { DataContext } from "./data";
import Api from "./api";

function RouteTo(Layout, Component) {
  return <Layout><Component /></Layout>
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
export default function useRouter(Routes, props) {
  const ref = useRef(false);

  const [data, setData] = useState(props.data)

  const value = [data, setData];

  const [path, setPath] = useState(getPathName())

  useEffect(() => {

    if (!ref.current) {

      history.pushState = (f => function pushState() {
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
      })(history.pushState);

      history.replaceState = (f => function replaceState() {
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
      })(history.replaceState);

      window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'))
      });


      window.addEventListener("updatedatacontext", (event) => {
        Api(window.location.pathname).then(function (fetchData) {
          setData(fetchData)
        })
      })

      window.addEventListener("locationchange", (event) => {
        Api(window.location.pathname).then(function (fetchData) {
          setData(fetchData)
          setPath(getPathName())
        })
      })
      ref.current = true;
    }
  }, [])

  let content
  for (let x in Routes) {
    let route = Routes[x][0]
    if (route.substr(0, -1) != '/')
      route += '/'

    if (path == route) {
      content = RouteTo(Routes[x][1], Routes[x][2])
      break
    }
  }

  return <DataContext.Provider value={value}>{content}</DataContext.Provider>
}