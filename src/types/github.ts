export type User = {
  id: number;
  login: string;
  avatar_url: string;
};

export type UsersRes = {
  total_count: number;
  items: Array<User>;
};

export type Repo = {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
};

export type ReposRes = Repo[];
