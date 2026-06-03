export interface LoginRequest {
  email: string;
  password: string;
}


export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}


export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterResponse{
  id:number;
  username: string;
  email: string;
}


export interface UserResponse {
  id: number;
  username: string;
  email: string;
}

 export interface RegisterFormModel  {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};


export interface LoginFormModel {
  email: string;
  password: string;
  
}