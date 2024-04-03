import Guest from './components/layout/guest'
import Layout from './components/layout/auth'
import * as Menus from './pages/menus'
import Dashboard from './pages/dashboard'
import NoPage from './pages/nopage'
import Login from './pages/login'
import './App.css'
import './scripts/nodelist'
import Main from './scripts/main'

import { useEffect, useRef } from "react";
import Scripts from "./scripts/scripts";

import useRouter from "./router/router";

let Routes = {
  '/': [Guest, Login],
  '/menus': [Layout, Menus.Index],
  '/login': [Guest, Login],
  '/dashboard': [Layout, Dashboard],
  '*': [Guest, NoPage]
};

export default function App({ ...props }) {
  const content = useRouter(Routes, props)
  const mainRef = useRef(false)

  useEffect(function () {
    Scripts()
    if( mainRef.current == false ) {
      Main()
      mainRef.current = true
    }
  }, [window.location.pathname])

  return content
}
