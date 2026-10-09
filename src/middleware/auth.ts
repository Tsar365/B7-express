import type { NextFunction, Request, Response } from "express";

// const auth=(req:Request, res:Response, next: NextFunction)=>{
//     console.log("this is protected route");
//     next();
// }

const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log("the token is:",req.headers.authorization);
    const token = req.headers.authorization;

if(!token){
      res.status(401).json({
      success: false,
      message: "Unthorized access!!!"
  
    });
}


    next();
  };
};

export default auth;