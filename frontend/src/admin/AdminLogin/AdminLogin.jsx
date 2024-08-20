import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../AdminLayout/Layout";

import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Password } from 'primereact/password';
import { Checkbox } from "primereact/checkbox";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { RadioButton } from 'primereact/radiobutton';

import Preloader from "../../Preloader";
import api from "../../api";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";
import withComponentName from "../../withComponentName";

const AdminLogin = () => {
    const toast = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [checked, setChecked] = useState(false);
    const [require, setRequire] = useState(false);
    const [loading, setLoading] = useState(false);

    const initialSigInInfo = {
        email: '',
        password: '',
        role: ""
    }
    const [signInInfo, setSignInInfo] = useState(initialSigInInfo);

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setSignInInfo({ ...signInInfo, [name]: value });
    };

    const login = async (loginInfo) => {
        setLoading(true);
        try {
            const response = await api.post("/api/auth/login", loginInfo);
            console.log(response.data);
            if (toast.current) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Login Successful',
                    detail: "You have been logged in successfully",
                    life: 3000
                });
            }
            setTimeout(() => {
                dispatch(
                    setLogin({
                        user: response.data.user,
                        token: response.data.token
                    })
                )
            }, 2000);
            // navigate('/admin-dashboard');
        } catch (err) {
            console.log(err);
            toast.current.show({
                severity: 'error',
                summary: 'Failed to Logged In',
                detail: err.response.data.error,
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!signInInfo.email || !signInInfo.password || !signInInfo.role) {
            setRequire(true);
            toast.current.show({
                severity: 'error',
                summary: 'Error in Submission',
                detail: "Please fill all required fields!",
                life: 3000
            });
            return;
        }

        await login(signInInfo);
        setSignInInfo(initialSigInInfo);
    };

    return (
        <>
            <Toast ref={toast} />

            <div className="login_bg">
                <div className="col-12 col-xl-4 col-lg-6 col-sm-8 col-md-88 mx-auto">
                    <article className="custom-card" data-aos="fade-up">
                        <div className="custom-card-logo-area">
                            <img src="assets/images/logo.png" className='custom-card-logo' alt="The Parking Deals" />
                        </div>
                        <h3 className="custom-card-tile">Admin Login</h3>
                        <h6 className="custom-card-sub-tile">Welcome Back! Please enter your credentials to access the admin dashboard</h6>
                        <form action="" className="custom-card-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="custom-form-group contains-float-input">
                                <FloatLabel>
                                    <InputText id="email" keyfilter="email" className="custom-form-input" name="email"
                                        value={signInInfo.email}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="email" className="custom-float-label">Email</label>
                                </FloatLabel>
                                {(require && !signInInfo.email) && (
                                    <small className="text-danger form-error-msg">
                                        This field is required
                                    </small>
                                )}
                                <small className="text-danger form-error-msg">
                                    {!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                        signInInfo.email
                                    ) && signInInfo.email
                                        ? "Enter valid email"
                                        : ""}
                                </small>
                            </div>

                            <div className="custom-form-group contains-float-input">
                                <FloatLabel>
                                    <Password className="custom-form-input"
                                        name="password"
                                        value={signInInfo.password}
                                        onChange={handleInputChange}
                                        feedback={false} toggleMask />
                                    <label htmlFor="username" className="custom-float-label">Password</label>
                                </FloatLabel>
                                {(require && !signInInfo.password) && (
                                    <small className="text-danger form-error-msg">
                                        This field is required
                                    </small>
                                )}
                            </div>

                            <div className="custom-form-group contains-float-input">
                                <div className="custom-role-group">
                                    <label className="custom-role-label">Role</label>
                                    <div className="custom-role-options">
                                        <div className="custom-role-option">
                                            <RadioButton inputId="roleAdmin" name="role" value="Admin"
                                                onChange={handleInputChange} checked={signInInfo.role === 'Admin'} />
                                            <label htmlFor="roleAdmin" className="custom-role-label">Admin</label>
                                        </div>
                                        <div className="custom-role-option">
                                            <RadioButton inputId="roleModerator" name="role" value="Moderator"
                                                onChange={handleInputChange} checked={signInInfo.role === 'Moderator'} />
                                            <label htmlFor="roleModerator" className="custom-role-label">Moderator</label>
                                        </div>
                                        <div className="custom-role-option">
                                            <RadioButton inputId="roleUser" name="role" value="User"
                                                onChange={handleInputChange} checked={signInInfo.role === 'Admin-User'} />
                                            <label htmlFor="roleUser" className="custom-role-label">User</label>
                                        </div>
                                    </div>
                                    {(require && !signInInfo.role) && (
                                        <small className="text-danger form-error-msg">
                                            Please select a role
                                        </small>
                                    )}
                                </div>
                            </div>

                            <div className="custom-form-group contains-float-input">
                                <div className="custom-check-group">
                                    <div className="custom-check-area">
                                        <Checkbox inputId="rememberMe" onChange={e => setChecked(e.checked)} checked={checked}></Checkbox>
                                        <label htmlFor="rememberMe" className="custom-check-label">Remember me</label>
                                    </div>

                                </div>
                            </div>

                            <div className="custom-form-group contains-float-input mb-0">
                                <Button label="LOGIN" className="w-100 submit-button justify-content-center"
                                    loading={loading} />
                            </div>
                        </form>
                    </article>
                </div>
            </div>
        </>
    )
}

export default withComponentName(AdminLogin, 'AdminLogin');