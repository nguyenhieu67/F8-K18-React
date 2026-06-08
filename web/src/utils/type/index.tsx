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

interface ListI {
  id: string;
  boardId: string;
  title: string;
  isSaved: boolean;
  isShrink: boolean;
}

interface CardI {
  id: string;
  listId: string;
  boardId: string;
  content: string;
  isSaved: boolean;
}

export type { LoginResponseI, AuthI, UserI, BoardI, ListI, CardI };
