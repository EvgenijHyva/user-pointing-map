export interface Owner {
  first_name: string;
  last_name: string;
  age: number | null;
  username: string;
  is_active: boolean;
}

export interface PointData {
  point: string;
  label: string | null;
  title: string;
  form: string;
}

export interface PointResponseData extends PointData {
  id: number;
  owner: Owner;
  created_at: string;
  updated_at: string;
}

