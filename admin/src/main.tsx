import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Api from './router/api.tsx';
import './i18n';

Api("/admin/data").then((mainData) => {
  Api(window.location.pathname).then((fetchData) => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <App data={fetchData} mainData={mainData} />
    )
  })
})