import { Router } from "express";
import { profileControler } from "./profile.controller";

const router = Router();

router.post("/", profileControler.createProfile)

export const profileRoute=router;