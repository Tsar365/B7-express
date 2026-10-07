import type { Request, Response } from "express"
import { authService } from "./auth.service";

const loginUser= async(req: Request, res: Response)=>{

try{

const result =await authService.loginUserIntoDB(req.body)

  res.status(201).json({
        success:true,
        message: "profile craeted successful!",
        data: result,
  });

} catch(error:any){
      res.status(500).json({
      success: false,
      message: "Error inserting data into database",
      error: error.message,
    });
}

}

export const authController={
    loginUser
}