import { User } from "../models/user.js";
import ErrorHandler from "../utils/error.js";
import jwt from "jsonwebtoken";
import { asyncError } from "./error.js";


export const isAuthenticated = asyncError(async (req, res, next) => {
  // Check for token in cookies or Authorization header
  let token = req.cookies.token;
  
  // If no cookie token, check Authorization header
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next(new ErrorHandler("Not Logged In", 401));

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData._id);
  next();
});

export const isAdmin = asyncError(async (req, res, next) => {
  if (req.user.role !== "admin")
    return next(new ErrorHandler("Only Admin allowed", 401));
  next();
});
