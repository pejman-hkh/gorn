import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Api from './router/api.tsx';

Api(window.location.pathname).then(function (fetchData) {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <App data={fetchData} />
  )
})