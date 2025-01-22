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


export interface CreateUserRequest {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    isAdmin: boolean;
}

export interface UpdateUserRequest {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    isAdmin: boolean;
}
