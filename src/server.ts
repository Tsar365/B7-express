import express, {
  type Application,
  type Request,
  type Response,
} from "express";
const app: Application = express();
const port = 5000;

app.use(express.json()); //req er age use krte hbe

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
console.log(req.body);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
