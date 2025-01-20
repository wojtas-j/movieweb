import React, { useState, useContext, FormEvent } from 'react';
import { AuthContext } from '../contexts/AuthContext';

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
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Logowanie nie powiodło się');
            }
        }
    };


    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
            <h2>Logowanie</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="username">Nazwa użytkownika:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="password">Hasło:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" style={{ padding: '10px 20px' }}>Zaloguj się</button>
            </form>
        </div>
    );
};

export default Login;
