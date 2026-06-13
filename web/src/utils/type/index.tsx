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
  avatar?: string;
}

interface BackgroundI {
  type: string;
  value: string;
}

interface BoardI {
  id: string;
  userId: string;
  title: string;
  listOrderIds: string[];
  background: BackgroundI;
  isStarred?: boolean;
  members?: string[];
  inviteToken?: string | null;
}

interface ListI {
  id: string;
  boardId: string;
  title: string;
  cardOrderIds: string[];
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
