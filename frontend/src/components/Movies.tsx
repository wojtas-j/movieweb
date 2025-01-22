import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { MovieDto } from '../types/auth';
import axios from 'axios';

const Movies: React.FC = () => {
    const { isAuthenticated, isAdmin, logout } = useContext(AuthContext);
    const [movies, setMovies] = useState<MovieDto[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await api.get<MovieDto[]>('/movies');
                setMovies(response.data);
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data || 'Nie udało się pobrać filmów');
                } else if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Nie udało się pobrać filmów');
                }
            }
        };

        if (isAuthenticated) {
            fetchMovies();
        }
    }, [isAuthenticated]);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Wylogowanie nie powiodło się:', error);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px', backgroundColor: '#f0f0f0' }}>
                <button onClick={handleLogout} style={{ padding: '8px 16px' }}>
                    Wyloguj się
                </button>
            </header>
            <main style={{ padding: '20px' }}>
                <h2>Lista Filmów</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <ul>
                    {movies.map(movie => (
                        <li key={movie.id}>
                            <h3>{movie.name}</h3>
                            <p>{movie.description}</p>
                            <p>Ocena: {movie.rating}</p>
                            <p>Reżyser: {movie.director}</p>
                            <p>Data premiery: {movie.releaseDate}</p>
                            <img src={movie.imageUrl} alt={movie.name} style={{ width: '200px' }} />
                            {isAdmin && (
                                <div>
                                    <button style={{ marginRight: '10px' }}>Edytuj</button>
                                    <button>Usuń</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
};

export default Movies;
