import { LmTrainMaizeModel, LmPredictMaizeDisease } from "../../controller/lmmaizecontroller";
import { Router } from "express";

const router = Router();

//Train the model
router.post("/lm/maize/train", LmTrainMaizeModel);
router.post("/lm/maize/predict", LmPredictMaizeDisease);

export default router;