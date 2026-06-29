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
  username: string;
  email: string;
  password?: string;
  avatar?: string;
}

interface BackgroundI {
  type: string;
  value: string;
  publicId?: string;
}

interface BoardI {
  id: string;
  userId: string;
  title: string;
  slug: string;
  lists: ListI[];
  cards: CardI[];
  listOrderIds: string[];
  background: BackgroundI;
  isStarred?: boolean;
  members?: string[];
  inviteToken?: string | null;
  isClosed?: boolean;
  createdAt?: string;
}

interface ListI {
  id: string;
  boardId: string;
  title: string;
  cardOrderIds: string[];
  isSaved: boolean;
  isShrink: boolean;
  createdAt?: string;
}


interface AttachmentI {
  id: string;
  cardId?: string;
  userId?: string;
  url: string;
  fileName: string;
  fileHash: string,
  publicId: string,
  createdAt: number,
}

interface CardI {
  id: string;
  listId: string;
  boardId: string;
  content: string;
  isSaved: boolean;
  cover: string | null;
  attachments: AttachmentI[];
  createdAt?: string;
}

export type { LoginResponseI, AuthI, UserI, BoardI, ListI, CardI, AttachmentI, BackgroundI };
