import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Status: React.FC = () => {
    const { isAuthenticated, isAdmin, user, logout } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Wylogowanie nie powiodło się:', error);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h3>Status Użytkownika</h3>
            <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
            <p>Admin: {isAdmin ? 'Yes' : 'No'}</p>
            {user && (
                <div>
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                </div>
            )}
            {isAuthenticated && (
                <button onClick={handleLogout} style={{ marginTop: '20px', padding: '10px 20px' }}>
                    Wyloguj się
                </button>
            )}
        </div>
    );
};

export default Status;
