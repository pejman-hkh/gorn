import Guest from './components/layout/guest'
import Layout from './components/layout/auth'
import * as Categories from './shop/categories'
import * as PostCategories from './post/categories'
import * as PostType from './post/types'
import * as PostPost from './post/posts'
import * as Menus from './pages/menus'
import * as Logs from './pages/logs'
import * as Groups from './pages/groups'
import * as Users from './pages/users'
import * as Settings from './pages/settings'
import * as Pages from './pages/pages'
import * as Medias from './pages/medias'
import Dashboard from './pages/dashboard'
import NoPage from './pages/nopage'
import Login from './pages/login'
import './App.css'
import './scripts/nodelist'
import Main from './scripts/main'

import { useEffect, useRef, useState } from "react";
import Scripts from "./scripts/scripts";

import useRouter from "./router/router";
import { useTranslation } from 'react-i18next'
import { resources } from './i18n'

let routes = {
  '/': [Guest, Login],
  '/shop/categories': [Layout, Categories.Index],
  '/post/categories': [Layout, PostCategories.Index],
  '/post/types': [Layout, PostType.Index],
  '/post/posts': [Layout, PostPost.Index],
  '/menus': [Layout, Menus.Index],
  '/logs': [Layout, Logs.Index],
  '/pages': [Layout, Pages.Index],
  '/medias': [Layout, Medias.Index],
  '/groups': [Layout, Groups.Index],
  '/users': [Layout, Users.Index],
  '/settings': [Layout, Settings.Index],
  '/login': [Guest, Login],
  '/dashboard': [Layout, Dashboard],
  '*': [Guest, NoPage]
};

function Loading({ ...props }) {
  const handler = () => {
    props?.fref.current.classList.add('hidden')
  }

  return <div ref={props?.fref} onClick={handler} className="hidden bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40"></div>
}

export default function App({ ...props }) {
  const loading = useRef<any>(null)

  const baseUri = "/admin"
  const content = useRouter(baseUri, () => {
    const { i18n } = useTranslation();
    const res: any = resources
    const direction = useState<string>(res[i18n.language].direction)
    const darkMode = useState<string>(localStorage.getItem("dark") || "")
    const [data, setData] = useState(props.data)
    const value = [data, setData, { baseUri: baseUri }, props?.mainData?.data, direction, darkMode];
    return value
  }, routes, () => {
    loading.current.classList.remove('hidden')
  }, () => {
    loading.current.classList.add('hidden')
  })
  const mainRef = useRef(false)

  useEffect(function () {
    Scripts()
    if (mainRef.current == false) {
      Main()
      mainRef.current = true
    }
  }, [window.location.pathname])

  return <><Loading fref={loading} />{content}</>
}
