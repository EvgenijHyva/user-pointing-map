export interface Owner {
  first_name: string;
  last_name: string;
  age: number | null;
  username: string;
  is_active: boolean;
  color: string;
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

