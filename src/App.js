import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Auth from './Middleware/auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Context from './components/Context';
import { CSpinner, useColorModes } from '@coreui/react';
import './scss/style.scss';
import './scss/examples.scss';

const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Page404 = React.lazy(() => import('./Error/404'));

export const  test = () =>{
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
    <Context>
    <ToastContainer />
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
       <Routes>
         
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
       
            <Route path="/" element={<DefaultLayout />} />
            <Route path="*" element={<DefaultLayout />} />
        
          <Route path="*" element={<Page404 />} />


           <Route element={<Auth />}>
            </Route>

        </Routes>
        
      </Suspense>
    </BrowserRouter>
    </Context>
    </>
  );
};

export default App;
