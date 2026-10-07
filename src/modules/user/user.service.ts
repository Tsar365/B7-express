import { pool } from "../../db";
import type { IUser } from "./user.interface";

const createUserIntoDB = async ( payload:IUser)=>{
    const { name, email, password, age } = payload; 
    const result = await pool.query(
      "INSERT INTO users (name, email, password, age) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, password, age],
    );
    return result;  //contoller e result return krbe
} 

const getAllUsersFromDB = async () => {
const result = await pool.query("SELECT * FROM users");
return result;
}


const getSingleUserFromDB = async (id: string) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
return result;
};


const uodateUserInDB = async (payload: IUser, id: string) => {
  const { name, is_active, password, age } = payload;

     const result = await pool.query(
      "UPDATE users SET name = COALESCE($1, name), is_active = COALESCE($2, is_active), password = COALESCE($3, password), age = COALESCE($4, age), updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *",
      [name, is_active, password, age, id],
    );

return result;
}



const deleteUserFromDB = async (id: string) => {
 const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id],
    );
    return result;
}

export const userService = {
    createUserIntoDB,
    getAllUsersFromDB,
    getSingleUserFromDB,
    uodateUserInDB,
    deleteUserFromDB
};
