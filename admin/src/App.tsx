import Guest from './components/layout/guest'
import Layout from './components/layout/auth'
import * as Menus from './pages/menus'
import * as Groups from './pages/groups'
import * as Users from './pages/users'
import * as Settings from './pages/settings'
import * as Pages from './pages/pages'
import Dashboard from './pages/dashboard'
import NoPage from './pages/nopage'
import Login from './pages/login'
import './App.css'
import './scripts/nodelist'
import Main from './scripts/main'

import { useEffect, useRef } from "react";
import Scripts from "./scripts/scripts";

import useRouter from "./router/router";

let routes = {
  '/': [Guest, Login],
  '/menus': [Layout, Menus.Index],
  '/pages': [Layout, Pages.Index],
  '/groups': [Layout, Groups.Index],
  '/users': [Layout, Users.Index],
  '/settings': [Layout, Settings.Index],
  '/login': [Guest, Login],
  '/dashboard': [Layout, Dashboard],
  '*': [Guest, NoPage]
};

function Loading({...props}) {
  const handler = () => {
    props?.fref.current.classList.add('hidden')
  }

  return <div ref={props?.fref} onClick={handler} className="hidden bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40"></div>
}

export default function App({ ...props }) {
  const loading = useRef<any>(null)

  const content = useRouter("/admin", routes, props, () => {
    loading.current.classList.remove('hidden')
  }, () => {
    loading.current.classList.add('hidden')
  })
  const mainRef = useRef(false)

  useEffect(function () {
    Scripts()
    if( mainRef.current == false ) {
      Main()
      mainRef.current = true
    }
  }, [window.location.pathname])

  return <><Loading fref={loading} />{content}</>
}
