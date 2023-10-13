export interface Owner {
  id: number;
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

export interface PointBase {
  label: string | null;
  title: string;
  comment: string | null;
  point: string;
}
export interface PointData extends PointBase {
  textColor: string;
}

export interface NewPointDTO extends PointBase {
  created_at: Date;
  updated_at: Date;
}

export interface PointResponseData extends PointData {
  id: number;
  owner: Owner | null;
  created_at: string;
  updated_at: string;
}

export interface TokenAuth {
  jwt: string;
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface RegisterDTO extends LoginDTO {
  email?: string;
  first_name?: string;
  last_name?: string;
  age?: number | null;
}