import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth  from '../hooks/hookAuthUser.ts'; // Add this line
import { Section, Title, ErrorMessage, Offscreen, Form, Label, Input, Button } from '../styles/login.tsx';
import axios from '../axios/api.ts'

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
        <Section>
            <Title>Sign In</Title>

            <Form onSubmit={handleSubmit}>
                <Label htmlFor="username">Login:</Label>
                <Input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUserName(e.target.value)}
                    value={username}
                    required
                />

                <Label htmlFor="password">Senha:</Label>
                <Input
                    type="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                />
                <Button type="submit">Logar</Button>
            </Form>
        </Section>
    );
};

export default Login;
