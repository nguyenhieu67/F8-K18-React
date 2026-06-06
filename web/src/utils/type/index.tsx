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
}

interface BoardI {
  id: string;
  userId: string;
  boardTitle: string;
}

export type { LoginResponseI, AuthI, UserI, BoardI };
