import express,{Response, Request} from "express";
import LmRoutes from "./routes/lmroutes/index";
import cookieparser from "cookie-parser";
import { customError } from "./lib/customerror";

const app = express();

app.use(express.json());
app.use(cookieparser());
app.use("/api", LmRoutes);

//Next error handler middleware
app.use(customError);


export default app;

