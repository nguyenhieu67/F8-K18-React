// Login type
interface LoginResponseI {
  accessToken: string;
  refreshToken: string;
  user: [];
}

interface AuthI {
  email: string;
  password: string;
}

interface UserI {
  id: string;
  name: string;
  email: string;
  password?: string;
}

interface BoardI {
  id: string;
  userId: string;
  title: string;
}

export type { LoginResponseI, AuthI, UserI, BoardI };
