import { RegisterBeachRequest } from "./register-beach-request";

export interface RegisterBeachResponse extends Omit<RegisterBeachRequest, 'position'> {
  id: string,
  position: string
}