import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import axios from 'axios';
import './Users.css';

interface UserDto {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    isAdmin: boolean;
}

interface CreateUserRequest {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    isAdmin: boolean;
}

const Users: React.FC = () => {
    const { isAuthenticated, isAdmin } = useContext(AuthContext);
    const [users, setUsers] = useState<UserDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [newUser, setNewUser] = useState<CreateUserRequest>({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phoneNumber: '',
        password: '',
        isAdmin: false,
    });
    const [editingUser, setEditingUser] = useState<UserDto | null>(null);
    const [editFormData, setEditFormData] = useState<CreateUserRequest>({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phoneNumber: '',
        password: '',
        isAdmin: false,
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get<UserDto[]>('/admin/users');
                setUsers(response.data);
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data || 'Nie udało się pobrać użytkowników');
                } else if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Nie udało się pobrać użytkowników');
                }
            }
        };

        if (isAuthenticated && isAdmin) {
            fetchUsers();
        }
    }, [isAuthenticated, isAdmin]);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post<UserDto>('/admin/users', newUser);
            setUsers([...users, response.data]);
            setShowAddForm(false);
            setNewUser({
                firstName: '',
                lastName: '',
                username: '',
                email: '',
                phoneNumber: '',
                password: '',
                isAdmin: false,
            });
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data || 'Nie udało się dodać użytkownika');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Nie udało się dodać użytkownika');
            }
        }
    };

    const handleEditUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        try {
            const response = await api.put<UserDto>(`/admin/users/${editingUser.id}`, editFormData);
            const updatedUsers = users.map(user =>
                user.id === editingUser.id ? response.data : user
            );
            setUsers(updatedUsers);
            setEditingUser(null);
            setEditFormData({
                firstName: '',
                lastName: '',
                username: '',
                email: '',
                phoneNumber: '',
                password: '',
                isAdmin: false,
            });
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data || 'Nie udało się zaktualizować użytkownika');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Nie udało się zaktualizować użytkownika');
            }
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!window.confirm('Czy na pewno chcesz usunąć tego użytkownika?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            const updatedUsers = users.filter(user => user.id !== id);
            setUsers(updatedUsers);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data || 'Nie udało się usunąć użytkownika');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Nie udało się usunąć użytkownika');
            }
        }
    };

    const startEditing = (user: UserDto) => {
        setEditingUser(user);
        setEditFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            password: '', // Nie zmieniamy hasła podczas edycji
            isAdmin: user.isAdmin,
        });
    };

    const cancelEditing = () => {
        setEditingUser(null);
        setEditFormData({
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            phoneNumber: '',
            password: '',
            isAdmin: false,
        });
    };

    if (!isAuthenticated || !isAdmin) {
        return null;
    }

    return (
        <div className="users-container">
            <h2>Lista Użytkowników</h2>
            {error && <p className="error-message">{error}</p>}
            <button className="add-user-button" onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? 'Anuluj Dodawanie' : 'Dodaj Użytkownika'}
            </button>
            {showAddForm && (
                <form className="add-user-form" onSubmit={handleAddUser}>
                    <h3>Dodaj Nowego Użytkownika</h3>
                    <div className="form-group">
                        <label htmlFor="firstName">Imię:</label>
                        <input
                            type="text"
                            id="firstName"
                            value={newUser.firstName}
                            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                            required
                            placeholder="Wprowadź imię"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Nazwisko:</label>
                        <input
                            type="text"
                            id="lastName"
                            value={newUser.lastName}
                            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                            required
                            placeholder="Wprowadź nazwisko"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Nazwa użytkownika:</label>
                        <input
                            type="text"
                            id="username"
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            required
                            placeholder="Wprowadź nazwę użytkownika"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            required
                            placeholder="Wprowadź email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Numer Telefonu:</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            value={newUser.phoneNumber}
                            onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                            required
                            placeholder="Wprowadź numer telefonu"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Hasło:</label>
                        <input
                            type="password"
                            id="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            required
                            placeholder="Wprowadź hasło"
                        />
                    </div>
                    <div className="form-group checkbox-group">
                        <label htmlFor="isAdmin">Administrator:</label>
                        <input
                            type="checkbox"
                            id="isAdmin"
                            checked={newUser.isAdmin}
                            onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                        />
                    </div>
                    <button type="submit" className="submit-button">Dodaj Użytkownika</button>
                </form>
            )}
            <ul className="users-list">
                {users.map(user => (
                    <li key={user.id} className="user-item">
                        {editingUser?.id === user.id ? (
                            <form className="edit-user-form" onSubmit={handleEditUser}>
                                <h3>Edycja Użytkownika</h3>
                                <div className="form-group">
                                    <label htmlFor={`edit-firstName-${user.id}`}>Imię:</label>
                                    <input
                                        type="text"
                                        id={`edit-firstName-${user.id}`}
                                        value={editFormData.firstName}
                                        onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                                        required
                                        placeholder="Wprowadź imię"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`edit-lastName-${user.id}`}>Nazwisko:</label>
                                    <input
                                        type="text"
                                        id={`edit-lastName-${user.id}`}
                                        value={editFormData.lastName}
                                        onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                                        required
                                        placeholder="Wprowadź nazwisko"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`edit-username-${user.id}`}>Nazwa użytkownika:</label>
                                    <input
                                        type="text"
                                        id={`edit-username-${user.id}`}
                                        value={editFormData.username}
                                        onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                                        required
                                        placeholder="Wprowadź nazwę użytkownika"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`edit-email-${user.id}`}>Email:</label>
                                    <input
                                        type="email"
                                        id={`edit-email-${user.id}`}
                                        value={editFormData.email}
                                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                        required
                                        placeholder="Wprowadź email"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`edit-phoneNumber-${user.id}`}>Numer Telefonu:</label>
                                    <input
                                        type="text"
                                        id={`edit-phoneNumber-${user.id}`}
                                        value={editFormData.phoneNumber}
                                        onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                                        required
                                        placeholder="Wprowadź numer telefonu"
                                    />
                                </div>
                                <div className="form-group checkbox-group">
                                    <label htmlFor={`edit-isAdmin-${user.id}`}>Administrator:</label>
                                    <input
                                        type="checkbox"
                                        id={`edit-isAdmin-${user.id}`}
                                        checked={editFormData.isAdmin}
                                        onChange={(e) => setEditFormData({ ...editFormData, isAdmin: e.target.checked })}
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="submit-button">Zapisz</button>
                                    <button type="button" className="cancel-button" onClick={cancelEditing}>Anuluj</button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="user-info">
                                    <p><strong>Imię:</strong> {user.firstName}</p>
                                    <p><strong>Nazwisko:</strong> {user.lastName}</p>
                                    <p><strong>Nazwa użytkownika:</strong> {user.username}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>Numer Telefonu:</strong> {user.phoneNumber}</p>
                                    <p><strong>Administrator:</strong> {user.isAdmin ? 'Tak' : 'Nie'}</p>
                                </div>
                                <div className="user-actions">
                                    <button className="edit-button" onClick={() => startEditing(user)}>Edytuj</button>
                                    <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>Usuń</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Users;