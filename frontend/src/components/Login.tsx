import React, { useState, useContext, FormEvent } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import './Login.css';

const Login: React.FC = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await login({ username, password });
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data || 'Logowanie nie powiodło się');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Logowanie nie powiodło się');
            }
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <div className="loginHeader">
                    <img
                        src="https://cdn.pixabay.com/photo/2019/04/24/21/55/cinema-4153289_640.jpg"
                        alt="MovieWeb Logo"
                        className="logo"
                    />
                    <h1 className="title">MovieWeb</h1>
                </div>
                <h2>Logowanie</h2>
                <div className="form-group">
                    <label htmlFor="username">Nazwa użytkownika:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="form-input"
                        placeholder="Wprowadź nazwę użytkownika"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Hasło:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input"
                        placeholder="Wprowadź hasło"
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="submit-button">Zaloguj się</button>
            </form>
        </div>
    );
};

export default Login;
