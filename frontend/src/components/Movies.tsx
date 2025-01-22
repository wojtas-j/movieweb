import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { MovieDto } from '../types/auth';
import axios from 'axios';
import './Movies.css';

const Movies: React.FC = () => {
    const { isAuthenticated, isAdmin } = useContext(AuthContext);
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


    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="movies-container">
            <main className="movies-main">
                <h2>Lista Filmów</h2>
                {error && <p className="error-message">{error}</p>}
                <ul className="movies-list">
                    {movies.map(movie => (
                        <li key={movie.id} className="movie-item">
                            <h3>{movie.name}</h3>
                            <p>{movie.description}</p>
                            <p>Ocena: {movie.rating}</p>
                            <p>Reżyser: {movie.director}</p>
                            <p>Data premiery: {movie.releaseDate}</p>
                            <img src={movie.imageUrl} alt={movie.name} className="movie-image" />
                            {isAdmin && (
                                <div className="admin-buttons">
                                    <button className="edit-button">Edytuj</button>
                                    <button className="delete-button">Usuń</button>
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
