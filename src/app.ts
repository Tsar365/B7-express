import config from "./config";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import {  pool } from "./db";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";

const app: Application = express();
// const port = config.port || 5000;

app.use(express.json()); //req er age use krte hbe
app.use(express.urlencoded({ extended: true })); //req er age use krte hbe
app.use(express.text()); //req er age use krte hbe

// POST, GET, Delete & UPDATE
app.use("/api/users", userRoute); // /api/users e hit krle userRoute e jabe

// For users route
app.use("/api/profile", profileRoute)

app.use("/api/auth",authRoute)

app.get("/", (req: Request, res: Response) => {
  // res.send("hello world");
  res.status(200).json({
    message: "hello world",
    author: "next level",
  });
});

// To see
app.delete("/api/user/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // 1. Delete the user
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id],
    );

    // 2. Check whether user existed
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3. Get all remaining users
    const remainingUsers = await pool.query("SELECT * FROM users");

    // 4. Return remaining users
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: remainingUsers.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
});

export default app;
