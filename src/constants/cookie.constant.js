export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";

export const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  // maxAge: 24 * 60 * 60 * 1000, // TODO: change this later
};
