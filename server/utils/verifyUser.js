import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  // const token = req.cookies.access_token;
  const token = req.headers.authorization;

  if (!token) return next(errorHandler(401, "Unauthorized"));
  const tokenValue = token.split(" ")[1];
  jwt.verify(tokenValue, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden"));

    req.user = user;
    next();
  });
};
