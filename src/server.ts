import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import {Pool} from "pg";


const app: Application = express();
const port = 5000;

app.use(express.json()); //req er age use krte hbe
app.use(express.urlencoded({ extended: true })); //req er age use krte hbe
app.use(express.text()); //req er age use krte hbe


const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_BJx16uzdDnmf@ep-wispy-brook-az3g0wbn-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});



app.get("/", (req: Request, res: Response) => {
  // res.send("hello world");
  res.status(200).json({
     "message": "hello world" ,
     "author": "next level",
    });
});

app.post("/", async (req: Request, res: Response) => {
//   res.status(200).json({
//     "message": "hello world" ,
//     "author": "next level",
//    });
// console.log(req.body);
// const body = req.body;
const { name, email, password } = req.body;
res.status(200).json({
    message: "hello world" ,
    author: "next level",
    // data: body,  //postman theke zeta send kra hbe
    data:{
        name,
        email,
    }

   });

});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
