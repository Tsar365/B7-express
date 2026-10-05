import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";

const app: Application = express();
const port = 5000;

app.use(express.json()); //req er age use krte hbe
app.use(express.urlencoded({ extended: true })); //req er age use krte hbe
app.use(express.text()); //req er age use krte hbe

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_BJx16uzdDnmf@ep-wispy-brook-az3g0wbn-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

const initDb = async () => {
  try {
    const client = await pool.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(100) NOT NULL,
            is_active BOOLEAN DEFAULT true,
            age INT,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
          `);
    console.log("Database connected and table created successfully");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

initDb();


app.get("/", (req: Request, res: Response) => {
  // res.send("hello world");
  res.status(200).json({
    message: "hello world",
    author: "next level",
  });
});


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
      data: result.rows,
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


// delete user
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


app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
