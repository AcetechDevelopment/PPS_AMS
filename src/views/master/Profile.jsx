import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer } from 'react-toastify';
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';



const Profile = () => {

    const BASE = import.meta.env.VITE_BASE_URL;
    const authToken = JSON.parse(sessionStorage.getItem('authToken')) || '';
    const [userinfo, setuserinfo] = useState({
        name: "",
        email: "",
        mobile: ""
        // password: "12345",
        // confirmpassword: "12345"
    });

    useEffect(() => {
        fetch(`${BASE}auth/view_user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
        })
        .then((res) => res.json())
        .then((data) => {
            setuserinfo(data.data);
            setsavedData(data.data)
        })
    }, [])
    console.log(userinfo)
    const [savedData, setsavedData] = useState({ ...userinfo });
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [isEditingSecurity, setIsEditingSecurity] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showconfirmPassword, setShowconfirmPassword] = useState(false);

    const handlechange = (e) => {
        const { name, value } = e.target;
        setuserinfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateInfo = (e) => {
        e.preventDefault();
        setsavedData((prev) => ({
            ...prev,
            name: "Nazia",
            email: userinfo.email,
            mobile: userinfo.mobile
        }));
        setIsEditingInfo(false);
    };

    const handleUpdateSecurity = (e) => {
        e.preventDefault();
        if (userinfo.password !== userinfo.confirmpassword) {
            toast.error("Passwords do not match!", {
                position: "top-right",
                autoClose: 3000,
            });
            return;

        }
        setsavedData((prev) => ({
            ...prev,
            password: userinfo.password,
            confirmpassword: userinfo.confirmpassword,
        }));
        setIsEditingSecurity(false);
    };

    return (
        <div className="container mt-4 overflow-y-hidden">
            <div className="row justify-content-center">
                <div className="col-lg-8">

                    {/* Avatar */}
                    <div className="card mb-3 text-center">
                        <div className="card-body">
                            <img
                                src="https://bootdey.com/img/Content/avatar/avatar6.png"
                                alt="User avatar"
                                className="rounded-circle img-fluid"
                                style={{ width: "120px", height: "120px" }}
                            />
                        </div>
                    </div>

                    {/* User Info */}
                    <form onSubmit={handleUpdateInfo} className="card mb-3">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">User Info</h5>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => setIsEditingInfo((prev) => !prev)}
                            >
                                {isEditingInfo ? "Cancel" : "Edit"}
                            </button>
                        </div>

                        <div className="card-body">
                            <div className="mb-2 row align-items-center">
                                <label className="col-sm-3 col-form-label">Name</label>
                                <div className="col-sm-9">
                                    {isEditingInfo ? (
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            value={userinfo.name}
                                            onChange={handlechange}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            name="name"
                                            style={{ border: "none" }}
                                            value={savedData.name}
                                            readOnly

                                        />
                                    )}
                                </div>
                            </div>

                            <div className="mb-3 row">
                                <label className="col-sm-3 col-form-label">Email</label>
                                <div className="col-sm-9">
                                    {isEditingInfo ? (
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={userinfo.email}
                                            onChange={handlechange}
                                        />
                                    ) : (
                                        <input
                                            type="email"
                                            name="email"
                                            style={{ border: "none" }}
                                            value={savedData.email}
                                            readOnly

                                        />)}

                                </div>
                            </div>
                            {isEditingInfo && (
                                <div className="d-flex justify-content-end">
                                    <button type="submit" className="btn btn-secondary">
                                        Update
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>

                    {/* Security */}
                    <form onSubmit={handleUpdateSecurity} className="card mb-3">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Security</h5>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => setIsEditingSecurity((prev) => !prev)}
                            >
                                {isEditingSecurity ? "Cancel" : "Edit"}
                            </button>
                        </div>

                        <div className="card-body">
                            <div className="mb-3 row align-items-center">
                                <label className="col-sm-3 col-form-label">Password</label>
                                <div className="col-sm-9 input-group">
                                    {isEditingSecurity ? (
                                        <>
                                            <input
                                                type={showPassword ? "password" : "text"}
                                                name="password"
                                                className="form-control"
                                                value={userinfo.password}
                                                onChange={handlechange}
                                            />
                                            <span
                                                className="input-group-text"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </span>
                                        </>
                                    ) : (
                                        <input
                                            type="password"
                                            name="email"
                                            style={{ border: "none" }}
                                            value={savedData.confirmpassword}
                                            readOnly

                                        />
                                    )}
                                </div>
                            </div>

                            <div className="mb-3 row">
                                <label className="col-sm-3 col-form-label">Confirm Password</label>
                                <div className="col-sm-9 input-group">
                                    {isEditingSecurity ? (
                                        <>
                                            <input
                                                type={showconfirmPassword ? "password" : "text"}
                                                name="confirmpassword"
                                                className="form-control"
                                                value={userinfo.confirmpassword}
                                                onChange={handlechange}
                                            />
                                            <span
                                                className="input-group-text"
                                                onClick={() => setShowconfirmPassword(!showconfirmPassword)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {showconfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </span>
                                        </>
                                    ) : (
                                        <input
                                            type="password"
                                            name="email"
                                            style={{ border: "none" }}
                                            value={savedData.confirmpassword}
                                            readOnly

                                        />
                                    )}
                                </div>
                            </div>

                            {isEditingSecurity && (
                                <div className="d-flex justify-content-end">
                                    <button type="submit" className="btn btn-secondary">
                                        Update
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}




export default Profile
