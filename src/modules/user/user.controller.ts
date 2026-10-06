import type { Request, Response } from "express";

import { pool } from "../../db";
import { userService } from "./user.service";


const createUser= async (req: Request, res: Response) => {
//   const { name, email, password, age } = req.body;
  try {
    
const result = await userService.createUserIntoDB(req.body);  //request body k userService er createUserIntoDB function e pathay dibe

    console.log(result);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      author: "next level",
      // data: body,  //postman theke zeta send kra hbe
      data:
        // {
        //     name,
        //     email,
        //     password,
        //     age
        // }
        result.rows[0], //database theke zeta return hbe
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error inserting data into database",
      error: error.message,
    });
}
};

export const userController = {
  createUser,
}; 