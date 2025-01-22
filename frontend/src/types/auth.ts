export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    message: string;
}

export interface UserDto {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    isAdmin: boolean;
}

export interface MovieDto {
    id: number;
    name: string;
    description: string;
    rating: number;
    releaseDate: string;
    director: string;
    imageUrl: string;
}