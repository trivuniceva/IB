export type UserRole = 'ADMIN' | 'CA_USER' | 'REGULAR_USER'


export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
  imageUrl?: string;
}
