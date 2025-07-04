import { LmEndpoint, LmDetect } from "../../controller/lmcontroller";
import express from "express";


const router = express.Router();

router.get("/lm", LmEndpoint);
router.get("/lm/detect", LmDetect);

export default router;
