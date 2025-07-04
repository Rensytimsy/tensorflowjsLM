import express,{Request, Response} from "express";
import app from "./app"
import { configdata } from "./config/config";

app.listen(configdata.port, () => {
    console.log(`server running at --> http://localhost:${configdata.port}`);
});