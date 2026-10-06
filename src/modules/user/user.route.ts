
// This is mini Server


import { Router, type Request, type Response } from "express";

import { userController } from "./user.controller";

const router=Router();

// create users
router.post("/", userController.createUser);  //userController.createUser e pathay dibe


export const userRoute=router