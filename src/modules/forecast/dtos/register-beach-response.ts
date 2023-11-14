import { Beach } from "./beach";

export interface RegisterBeachResponse extends Omit<Beach, 'position'> {
  id: string,
  position: string
}