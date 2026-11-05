import jwt from "jsonwebtoken";
import crypto from "node:crypto";

export const decodeToken = (token) => jwt.decode(token);

export const verifyToken = (token, type) => {
  const secret =
    type === "refresh"
      ? process.env.REFRESH_TOKEN_SECRET
      : process.env.ACCESS_TOKEN_SECRET;

  console.log(`verifying ${type} token`);

  try {
    const payload = jwt.verify(token, secret, {
      algorithms: ["HS256"],
      issuer: "basecamp-pm-backend",
      audience: "basecamp-pm-client",
    });

    return { status: "Verified", payload };
  } catch (err) {
    switch (err.name) {
      case "TokenExpiredError":
        return { status: "ExpiredToken", payload: jwt.decode(token) };
      case "JsonWebTokenError":
        return { status: "MalformedToken", payload: null };
      case "NotBeforeError":
        return { status: "InactiveToken", payload: null };
      default:
        return null;
    }
  }
};

export const signToken = (user, type) => {
  const secret =
    type === "refresh"
      ? process.env.REFRESH_TOKEN_SECRET
      : process.env.ACCESS_TOKEN_SECRET;

  const expiry =
    type === "refresh"
      ? process.env.REFRESH_TOKEN_EXPIRY
      : process.env.ACCESS_TOKEN_EXPIRY;

  const token = jwt.sign({ id: user._id }, secret, {
    algorithm: "HS256",
    expiresIn: `${expiry}m`,
    issuer: "basecamp-pm-backend",
    audience: "basecamp-pm-client",
    subject: user._id.toString(),
    jwtid: crypto.randomUUID(),
  });

  const decoded = decodeToken(token);

  return {
    token,
    iat: decoded.iat,
    exp: decoded.exp,
  };
};
