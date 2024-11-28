export type JWT = {
  id: string;
};

export interface ITokenManagerProvider {
  sign(payload: JWT, expiresIn?: string): Promise<string>;
}
