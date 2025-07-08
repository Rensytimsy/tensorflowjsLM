import express,{Response, Request} from "express";
import LmRoutes from "./routes/lmroutes/index";
import cookieparser from "cookie-parser";
import { customError } from "./lib/customerror";
import cors from "cors"
import {configdata} from "./config/config"
import { initializeModel } from "./config/tensorflowinit";

const app = express();


const cors_configurations = cors({
    origin: configdata.frontendpoint,
    methods: ["POST", "GET", "PUT", "DElETE"],
    credentials: true
});

(async() => {
    await initializeModel();
})();


app.use(express.json());
app.use(cookieparser());
app.use(cors_configurations);

app.use("/api", LmRoutes);

//Next error handler middleware
app.use(customError);


export default app;

