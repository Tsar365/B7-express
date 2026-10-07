// import { pool } from "../../db";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import config from "../../config";

// const loginUserIntoDB = async (payload: {
//   email: string;
//   password: string;
// }) => {
//   const { email, password } = payload;
//   //1. check if user exists
//   //2. compare the password
//   //3. generate token

//   const userData = await pool.query(
//     `
//     SELECT * FROM users WHERE email=$1
//     `,
//     [email],
//   );
//   if (userData.rows.length === 0) {
//     throw new Error("Invalid credintial");
//   }

//   const user = userData.rows[0];
//   //   console.log(user);
//   const matchPassword = await bcrypt.compare(password, user.password);
//   if (!matchPassword) {
//     throw new Error("invalid credintial");
//   }

//   const jwtpayload = {
//     id: user.id,
//     name: user.name,
//     is_active: user.is_active,
//     email: user.email,
//   };

//   const accessToken = jwt.sign(jwtpayload, config.secret as string, {
//     expiresIn: "1d",
//   });
//   return { accessToken };
// };

// export const authService = {
//   loginUserIntoDB,
// };



import { pool } from "../../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  // 1. Find user
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];

  // 2. Compare password
  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new Error("Invalid password");
  }

  // 3. Generate JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    config.secret as string,
    {
      expiresIn: "7d",
    },
  );

  // 4. Don't send password back
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
    },
    token,
  };
};

export const authService = {
  loginUserIntoDB,
};