import express,{Request, Response} from "express";


const app = express();

app.get("/", (req: Request, res: Response) => {
    res.send({message: "Hello world from root endpoint.. is this not awsome!"});
})

app.listen(3000, () => {
    console.log("http://localhost:3000")
})