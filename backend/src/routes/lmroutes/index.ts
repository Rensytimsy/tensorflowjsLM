import { LmTrainEndpoint, LmDetect, LmPredict } from "../../controller/lmcontroller";
import express from "express";


const router = express.Router();

router.post("/lm/train", LmTrainEndpoint);
router.post("/lm/detect", LmDetect);
router.post("/lm/predict", LmPredict);

export default router;
