export const jwtConstants = {
  secret: `${process.env.CHAT_JWTSECRET}`,
};

export enum SocialAuthType {
  REGISTER = 'REGISTER',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  APPLE = 'APPLE',
}
