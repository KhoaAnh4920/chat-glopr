export const jwtConstants = {
  secret: `${process.env.CHAT_JWTSECRET}`,
};

export enum TypeTokenLogin {
  REGISTER = 'REGISTER',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  APPLE = 'APPLE',
}
