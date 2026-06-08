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
  title: string;
}

interface ListI {
  id: string;
  title: string;
}

interface CardI {
  id: string;
  content: string;
}

export type { LoginResponseI, AuthI, UserI, BoardI, ListI, CardI };
