export enum Role {
  Admin = 'admin',
  User = 'user',
}

type User = { _id: string; user_id: string; password: string; role: Role };

export interface IAuthenticate {
  readonly user: User;
  readonly token: string;
}
