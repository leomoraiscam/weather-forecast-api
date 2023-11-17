export interface PersistenceBeachModel {
  id?: string;
  name: string;
  lat: number;
  lng: number;
  position: string;
  userId?: string;
  created_at?: Date;
  updated_at?: Date;
}