import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

// const auth=(req:Request, res:Response, next: NextFunction)=>{
//     console.log("this is protected route");
//     next();
// }

const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
  try {
      console.log("the token is:", req.headers.authorization);

    // 1. check if the token exists
    // 2. verify the token
    // 3. find the user into database
    // 4. if the user active or not

    const token = req.headers.authorization;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unthorized access!!!",
      });
    }

    const decoded = jwt.verify(
      token as string,
      config.secret as string,
    ) as JwtPayload;
    console.log(decoded);

    const userData = await pool.query(
      `
  SELECT * FROM users WHERE email=$1
  `,
      [decoded.email],
    );

    console.log(userData);

    const user = userData.rows[0];

    console.log(user);

    if (userData.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.is_active) {
      res.status(403).json({
        success: false,
        message: "Forbidden!!!",
      });
    }

    req.user= decoded

    next();
  } catch (error) {
    next(error);
  }
  };
};

export default auth;
