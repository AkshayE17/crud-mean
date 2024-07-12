
export interface User {
  _id: string;
  name: string;
  email: string;
  gender: string;
  mobile: string;
  imageUrl?: string;
}

export interface UserResponse {
  users: User[];
}

export interface AdminLoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    gender: string;
    mobile: string;
    imageUrl: string;
    isAdmin:boolean;
  };
}
