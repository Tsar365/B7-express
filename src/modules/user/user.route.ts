
// This is mini Server


import { Router, type Request, type Response } from "express";

import { userController } from "./user.controller";
import { pool } from "../../db";

const router=Router();

// create users
router.post("/", userController.createUser);  //userController.createUser e pathay dibe

// get all users
router.get("/", userController.getAllUsers);

// get single user
router.get("/:id", userController.getSingleUser);

// update user
router.put("/:id", userController.updateUser);


// delete user
router.delete("/:id", userController.deleteUser);



export const userRoute=router
