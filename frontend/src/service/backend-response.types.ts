export interface Owner {
  first_name: string;
  last_name: string;
  age: number | null;
  username: string;
  is_active: boolean;
  is_admin: boolean;
  color: string;
}

export interface AppUser extends Owner{
}

export interface PointData {
  point: string;
  label: string | null;
  title: string;
  comment: string;
  textColor: string;
}

export interface PointResponseData extends PointData {
  id: number;
  owner: Owner;
  created_at: string;
  updated_at: string;
}

export interface TokenAuth {
  jwt: string;
}

export interface LoginRegisterDTO {
  username: string;
  password: string;
}