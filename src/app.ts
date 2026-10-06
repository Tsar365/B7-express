import config from "./config";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { initDb, pool } from "./db";


const app: Application = express();
// const port = config.port || 5000;

app.use(express.json()); //req er age use krte hbe
app.use(express.urlencoded({ extended: true })); //req er age use krte hbe
app.use(express.text()); //req er age use krte hbe






app.get("/", (req: Request, res: Response) => {
  // res.send("hello world");
  res.status(200).json({
    message: "hello world",
    author: "next level",
  });
});

// create users
app.post("/api/users", async (req: Request, res: Response) => {
  const { name, email, password, age } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, password, age) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, password, age],
    );
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
});


// For all users
app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error retrieving users",
      error: error.message,
    });
  }
});


// For single user
app.get("/api/user/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log(req.params);
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

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
});


//Update user
app.put("/api/user/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, password, age, is_active } = req.body;

  try {
    const result = await pool.query(
      "UPDATE users SET name = COALESCE($1, name), is_active = COALESCE($2, is_active), password = COALESCE($3, password), age = COALESCE($4, age), updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *",
      [name, is_active, password, age, id],
    );

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
});


// Delete user
app.delete("/api/user/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id],
    );

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
    const remainingUsers = await pool.query(
      "SELECT * FROM users"
    );

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
