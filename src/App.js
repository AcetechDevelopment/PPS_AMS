import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Auth from './Middleware/auth';
// import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import Context from './components/Context';
import { CSpinner, useColorModes } from '@coreui/react';
import './scss/style.scss';
import './scss/examples.scss';
// import Timeline from './views/services/Timeline';
const BASE = import.meta.env.VITE_BASE_URL;
const Context = React.lazy(() => import('./components/Context'));
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Page404 = React.lazy(() => import('./Error/404'));
const ToastContainer = React.lazy(() =>
  import('react-toastify').then((module) => ({ default: module.ToastContainer }))
)
export const test = () => {
  return "test";
}

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const storedTheme = useSelector((state) => state.theme);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0];
    if (theme) {
      setColorMode(theme);
    }
    if (isColorModeSet()) {
      return;
    }
    setColorMode(storedTheme);
  }, []);
   

  return (
    <>


      <BrowserRouter>
        <ToastContainer />
        <Suspense
          fallback={
            <div className="pt-3 text-center">
              <CSpinner color="primary" variant="grow" />

            </div>
          }
        >
          <Context>
            <Routes>
              {/* Public route */}
              <Route path="/login" element={<Login />} />

              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              <Route element={<Auth />}>
                <Route path="/*" element={<DefaultLayout />} />  
              </Route>
              
              <Route path="*" element={<Page404 />} />

            </Routes>
          </Context>
        </Suspense>
      </BrowserRouter>

    </>
  );
};

export default App;
