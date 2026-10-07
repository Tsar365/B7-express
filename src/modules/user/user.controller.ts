import type { Request, Response } from "express";

import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  //   const { name, email, password, age } = req.body;
  try {
    const result = await userService.createUserIntoDB(req.body); //request body k userService er createUserIntoDB function e pathay dibe

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

//get all users
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsersFromDB();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error retrieving users",
      error: error.message,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log(req.params);
  try {
    const result = await userService.getSingleUserFromDB(id as string);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // console.log(result);
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error retrieving user",
      error: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await userService.uodateUserInDB(req.body, id as string);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // console.log(result);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.deleteUserFromDB(id as string);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
