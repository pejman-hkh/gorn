import Guest from './components/layout/guest'
import Layout from './components/layout/auth'
import * as Menus from './pages/menus'
import Dashboard from './pages/dashboard'
import NoPage from './pages/nopage'
import Login from './pages/login'
import './App.css'

import { useEffect } from "react";
import MainScript from "./scripts/scripts";

import useRouter from "./router/router";

window.apiUrl = 'http://localhost:8090';

let Routes = [
  ['/menus', Layout, Menus.Index],
  ['/login', Guest, Login],
  ['/dashboard', Layout, Dashboard],
  ['*', Guest, NoPage]
];

export default function App({ ...props }) {
  const content = useRouter(Routes, props)

  useEffect(function() {
    MainScript()
  }, [window.location.pathname])

  return content
}
