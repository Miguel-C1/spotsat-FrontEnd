import React, { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/hookAuthUser.ts';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import axios from '../axios/axios.ts';
const LOGIN_URL = '/login';

interface LoginResponse {
    username: string;
    token: string;
}

const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/home";

    const userRef = useRef<HTMLInputElement>(null);
    const errRef = useRef<HTMLParagraphElement>(null);

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        if (userRef.current)
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [username, password])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            
            const response = await axios.post<LoginResponse>(LOGIN_URL,
                JSON.stringify({ username, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            if (!response?.data?.username || !response?.data?.token) {
                console.log('Login Failed');
                throw new Error('Login Failed');
            }

            console.log('Login Success');

            const token = response?.data?.token;
            setAuth({ username, password, token });
            setUserName('');
            setPassword('');
            console.log('Navigating to:', from);
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
        }
    }

    return (

        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Login:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUserName(e.target.value)}
                    value={username}
                    required
                />

                <label htmlFor="password">Senha:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                />
                <button>Logar</button>
            </form>
        </section>

    )
}

export default Login