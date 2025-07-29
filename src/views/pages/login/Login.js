import React, { useEffect, useState } from "react"; 
import Cookies from "js-cookie";
import './login.css';
import { toast } from 'react-toastify';

// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [mobile, setmobile] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const savedmobile = Cookies.get("mobile");
        const savedPassword = Cookies.get("password");
        const savedRemember = Cookies.get("remember") === "true"; 

        if (savedmobile && savedPassword && savedRemember) {
            setmobile(savedmobile);
            setPassword(savedPassword);
            setRemember(true);
        }
    }, []);

    const signin = async() => {
        if (remember) {
            Cookies.set("mobile", mobile, { expires: 7 });
            Cookies.set("password", password, { expires: 7 });
            Cookies.set("remember", "true", { expires: 7 });
        } else {
            Cookies.remove("mobile");
            Cookies.remove("password");
            Cookies.remove("remember");
        }
        const payload = {
          mobile,
          password
        };

        try {
          const response = await fetch(`${apiUrl}login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
      
          if (response.ok) {
            const result = await response.json();
             sessionStorage.setItem("authToken", JSON.stringify(result.token));
             result.token?  window.location.href = "/dashboard" : '';
            
          } else {
            const error = await response.json();
            alert(`Error: ${error.message || 'Unable to Login user'}`);
          }
        } catch (err) {
          console.error('Error:', err);
          // alert('Failed to connect to the server. Please try again later.');
          toast.error('Failed to connect to the server. Please try again later.!');
        }


    };
    


return (
 <section className="vh-90 mt-5">
  <div className="container py-5 h-100">
    <div className="row d-flex align-items-center justify-content-center h-100">
      <div className="col-md-8 col-lg-7 col-xl-6">
        <img src="./loginbg.svg" className="img-fluid" alt="poster" />
      </div>
      <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">

            <div className="d-flex align-items-center mb-3 pb-1">
            {/* <img src="./mini.webp" className="img-fluid" alt="logo" /> */}
            <span className="h3 fw-bold mb-0 text-danger"> AMS APPLICATION</span>
            </div>

          <div data-mdb-input-init="" className="form-outline mb-4">
          <label className="form-label" htmlFor="form1Example13">Mobile Number</label>
            <input type="email" id="form1Example13" value={mobile} className="form-control form-control-lg" placeholder="Mobile Number" onChange={(e) => setmobile(e.target.value)}/>
          </div>

          <div data-mdb-input-init="" className="form-outline mb-4">
          <label className="form-label" htmlFor="form1Example23">Password</label>
            <input type="password" id="form1Example23" value={password} className="form-control form-control-lg" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
          </div>

          <div className="d-flex justify-content-around align-items-center mb-4">

            <div className="form-check">
              <input className="form-check-input" type="checkbox" value={true} id="form1Example3" checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
               />
              <label className="form-check-label" htmlFor="form1Example3"> Remember me </label>
            </div>
            <a href="#!" className="text-danger">Forgot password?</a>
          </div>

          <div className="form-outline mb-4">
          <button
                type="submit"
                className="btn btn-danger btn-outline-warning btn-lg btn-block w-100 text-light"
                onClick={signin}
                >
                Sign in
            </button>
          </div>
      </div>
    </div>
  </div>
</section>
);


}


export default Login;
